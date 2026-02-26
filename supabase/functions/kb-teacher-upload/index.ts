import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ChunkData {
  content: string;
  topic: string;
  metadata: Record<string, string>;
}

function chunkText(
  text: string,
  subject: string,
  grade: string,
  term: string
): ChunkData[] {
  const chunks: ChunkData[] = [];
  const lines = text.split("\n");

  let currentTopic = "General";
  let currentContent: string[] = [];
  let topicPattern =
    /^(?:topic|unit|chapter|module|section|theme|content\s*area)\s*[\d.:]+\s*[:\-–]?\s*(.+)/i;
  let headingPattern = /^#{1,3}\s+(.+)/;
  let numberedHeadingPattern = /^\d+[\.\)]\s+([A-Z].{3,})/;
  let capsHeadingPattern = /^([A-Z][A-Z\s]{5,})$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (currentContent.length > 0) currentContent.push("");
      continue;
    }

    let newTopic: string | null = null;

    const topicMatch = trimmed.match(topicPattern);
    if (topicMatch) {
      newTopic = topicMatch[1].trim();
    } else {
      const headingMatch = trimmed.match(headingPattern);
      if (headingMatch) {
        newTopic = headingMatch[1].trim();
      } else {
        const numberedMatch = trimmed.match(numberedHeadingPattern);
        if (numberedMatch) {
          newTopic = numberedMatch[1].trim();
        } else {
          const capsMatch = trimmed.match(capsHeadingPattern);
          if (capsMatch) {
            newTopic = capsMatch[1].trim();
          }
        }
      }
    }

    if (newTopic && currentContent.length > 0) {
      const contentText = currentContent.join("\n").trim();
      if (contentText.length > 50) {
        chunks.push({
          content: contentText,
          topic: currentTopic,
          metadata: {
            subject,
            topic: currentTopic,
            grade,
            term,
          },
        });
      }
      currentContent = [];
      currentTopic = newTopic;
    }

    currentContent.push(trimmed);
  }

  if (currentContent.length > 0) {
    const contentText = currentContent.join("\n").trim();
    if (contentText.length > 20) {
      chunks.push({
        content: contentText,
        topic: currentTopic,
        metadata: {
          subject,
          topic: currentTopic,
          grade,
          term,
        },
      });
    }
  }

  const maxChunkSize = 1500;
  const finalChunks: ChunkData[] = [];

  for (const chunk of chunks) {
    if (chunk.content.length <= maxChunkSize) {
      finalChunks.push(chunk);
    } else {
      const sentences = chunk.content.split(/(?<=[.!?])\s+/);
      let buffer = "";
      let partIndex = 0;

      for (const sentence of sentences) {
        if (buffer.length + sentence.length > maxChunkSize && buffer.length > 0) {
          finalChunks.push({
            content: buffer.trim(),
            topic: chunk.topic,
            metadata: {
              ...chunk.metadata,
              part: String(partIndex),
            },
          });
          buffer = sentence;
          partIndex++;
        } else {
          buffer += (buffer ? " " : "") + sentence;
        }
      }

      if (buffer.trim().length > 20) {
        finalChunks.push({
          content: buffer.trim(),
          topic: chunk.topic,
          metadata: {
            ...chunk.metadata,
            part: String(partIndex),
          },
        });
      }
    }
  }

  return finalChunks;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "upload";

    if (action === "upload" && req.method === "POST") {
      const { text, filename, fileSize, subject, grade, term } =
        await req.json();

      if (!text || !filename || !subject) {
        return new Response(
          JSON.stringify({ error: "Missing required fields: text, filename, subject" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const { data: doc, error: docError } = await supabase
        .from("kb_teacher_documents")
        .insert({
          teacher_id: user.id,
          filename,
          file_size: fileSize || 0,
          subject,
          grade: grade || "",
          term: term || "",
          status: "processing",
        })
        .select()
        .single();

      if (docError) {
        return new Response(JSON.stringify({ error: docError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const chunks = chunkText(text, subject, grade || "", term || "");

      const chunkRows = chunks.map((chunk, index) => ({
        document_id: doc.id,
        teacher_id: user.id,
        content: chunk.content,
        subject,
        topic: chunk.topic,
        grade: grade || "",
        term: term || "",
        chunk_index: index,
        metadata: chunk.metadata,
      }));

      if (chunkRows.length > 0) {
        const batchSize = 50;
        for (let i = 0; i < chunkRows.length; i += batchSize) {
          const batch = chunkRows.slice(i, i + batchSize);
          const { error: chunkError } = await supabase
            .from("kb_teacher_chunks")
            .insert(batch);

          if (chunkError) {
            await supabase
              .from("kb_teacher_documents")
              .update({ status: "failed" })
              .eq("id", doc.id);

            return new Response(
              JSON.stringify({ error: "Failed to store chunks: " + chunkError.message }),
              {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
              }
            );
          }
        }
      }

      await supabase
        .from("kb_teacher_documents")
        .update({ status: "completed", chunk_count: chunkRows.length })
        .eq("id", doc.id);

      return new Response(
        JSON.stringify({
          success: true,
          document_id: doc.id,
          chunk_count: chunkRows.length,
          topics: [...new Set(chunks.map((c) => c.topic))],
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (action === "search" && req.method === "POST") {
      const { subject, topic, grade } = await req.json();

      let query = supabase
        .from("kb_teacher_chunks")
        .select("content, topic, grade, term, metadata")
        .eq("teacher_id", user.id);

      if (subject) query = query.eq("subject", subject);
      if (topic) query = query.eq("topic", topic);
      if (grade) query = query.eq("grade", grade);

      const { data: chunks, error: searchError } = await query
        .order("chunk_index", { ascending: true })
        .limit(10);

      if (searchError) {
        return new Response(JSON.stringify({ error: searchError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ chunks: chunks || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "list" && req.method === "GET") {
      const { data: docs, error: listError } = await supabase
        .from("kb_teacher_documents")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false });

      if (listError) {
        return new Response(JSON.stringify({ error: listError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ documents: docs || [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "delete" && req.method === "DELETE") {
      const { document_id } = await req.json();

      const { error: deleteError } = await supabase
        .from("kb_teacher_documents")
        .delete()
        .eq("id", document_id)
        .eq("teacher_id", user.id);

      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "topics" && req.method === "POST") {
      const { subject, grade } = await req.json();

      const { data: chunks, error: topicError } = await supabase
        .from("kb_teacher_chunks")
        .select("topic")
        .eq("teacher_id", user.id)
        .eq("subject", subject);

      if (topicError) {
        return new Response(JSON.stringify({ error: topicError.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const topics = [...new Set((chunks || []).map((c: { topic: string }) => c.topic))].filter(
        (t) => t && t !== "General"
      );

      return new Response(JSON.stringify({ topics }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(err) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
