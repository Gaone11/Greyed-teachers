const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

interface RequestPayload {
  message: string;
  userId: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Parse the request body
    const { message, userId }: RequestPayload = await req.json();

    if (!message || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: message and userId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get OpenAI credentials from environment variables
    const uhuruApiKey = Deno.env.get("UHURU_API_KEY") || Deno.env.get("OPENAI_API_KEY");
    const uhuruApiUrl = Deno.env.get("UHURU_API_URL") || "https://api.openai.com/v1/chat/completions";
    const uhuruModel = Deno.env.get("UHURU_MODEL") || "gpt-4o";

    if (!uhuruApiKey) {
      return new Response(
        JSON.stringify({ error: "API configuration error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Prepare the payload for Uhuru AI API
    const payload = {
      model: uhuruModel,
      messages: [
        {
          role: "system",
          content: "You are El AI, a personalized AI tutor designed to help students with their studies. You specialize in explaining complex concepts in simple terms, adapting your teaching style to the student's needs, and providing accurate information based on the latest curriculum standards. Your responses should be educational, encouraging, and tailored to the student's subject area."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    };

    // Make the API request to Uhuru AI
    const response = await fetch(uhuruApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${uhuruApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Uhuru AI API error:', errorText);
      return new Response(
        JSON.stringify({ error: "Failed to get Uhuru AI response" }),
        {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();
    const aiResponse = data?.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response at this time.";

    return new Response(
      JSON.stringify({ response: aiResponse }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Error in Uhuru AI student function:', error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});