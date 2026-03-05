import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  convertInchesToTwip,
  ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';

/** Parse inline markdown (bold, italic, bold+italic) into TextRun[] */
function parseInlineMarkdown(text: string, defaults?: { bold?: boolean; size?: number }): TextRun[] {
  const runs: TextRun[] = [];
  // Match ***bold+italic***, **bold**, *italic*, and plain text
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|([^*]+))/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match[2]) {
      // ***bold+italic***
      runs.push(new TextRun({ text: match[2], bold: true, italics: true, size: defaults?.size, font: 'Calibri' }));
    } else if (match[3]) {
      // **bold**
      runs.push(new TextRun({ text: match[3], bold: true, size: defaults?.size, font: 'Calibri' }));
    } else if (match[4]) {
      // *italic*
      runs.push(new TextRun({ text: match[4], italics: true, size: defaults?.size, font: 'Calibri' }));
    } else if (match[5]) {
      // plain text
      runs.push(new TextRun({ text: match[5], bold: defaults?.bold, size: defaults?.size, font: 'Calibri' }));
    }
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text, bold: defaults?.bold, size: defaults?.size, font: 'Calibri' }));
  }

  return runs;
}

/** Parse a markdown table block (array of lines) into a docx Table */
function parseTable(lines: string[]): Table {
  // Filter out separator rows (|---|---|)
  const dataRows = lines.filter(line => {
    const cells = line.split('|').filter(c => c.trim() !== '');
    return !cells.every(c => /^[\s-:]+$/.test(c));
  });

  const rows = dataRows.map((line, rowIdx) => {
    const cells = line.split('|').filter(c => c.trim() !== '');
    const isHeader = rowIdx === 0;

    return new TableRow({
      children: cells.map(cell => {
        return new TableCell({
          children: [
            new Paragraph({
              children: parseInlineMarkdown(cell.trim(), {
                bold: isHeader,
                size: isHeader ? 20 : 20,
              }),
              spacing: { before: 40, after: 40 },
            }),
          ],
          width: { size: Math.floor(100 / cells.length), type: WidthType.PERCENTAGE },
          shading: isHeader
            ? { type: ShadingType.SOLID, color: 'E8E8E8', fill: 'E8E8E8' }
            : undefined,
          margins: {
            top: convertInchesToTwip(0.04),
            bottom: convertInchesToTwip(0.04),
            left: convertInchesToTwip(0.08),
            right: convertInchesToTwip(0.08),
          },
        });
      }),
    });
  });

  return new Table({
    rows,
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      left: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      right: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD' },
    },
  });
}

/** Convert full markdown string to a docx Document */
export function markdownToDocx(markdown: string, title?: string): Document {
  const lines = markdown.split('\n');
  const children: (Paragraph | Table)[] = [];
  let i = 0;

  // Optional document title
  if (title) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: title, bold: true, size: 36, font: 'Calibri', color: '1B4332' })],
        heading: HeadingLevel.TITLE,
        spacing: { after: 300 },
        alignment: AlignmentType.CENTER,
      })
    );
  }

  while (i < lines.length) {
    const line = lines[i];

    // Empty line
    if (line.trim() === '') {
      children.push(new Paragraph({ spacing: { after: 60 } }));
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: '' })],
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC', space: 1 } },
          spacing: { before: 200, after: 200 },
        })
      );
      i++;
      continue;
    }

    // Table block — collect consecutive | lines
    if (line.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      children.push(parseTable(tableLines));
      children.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    // Headings
    if (line.startsWith('#### ')) {
      children.push(
        new Paragraph({
          children: parseInlineMarkdown(line.substring(5), { bold: true, size: 22 }),
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 160, after: 80 },
        })
      );
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      children.push(
        new Paragraph({
          children: parseInlineMarkdown(line.substring(4), { bold: true, size: 24 }),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 240, after: 100 },
        })
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line.substring(3).replace(/\*\*/g, ''), bold: true, size: 28, font: 'Calibri', color: '1B4332' })],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 320, after: 140 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'DDDDDD', space: 4 } },
        })
      );
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: line.substring(2).replace(/\*\*/g, ''), bold: true, size: 32, font: 'Calibri', color: '1B4332' })],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 },
        })
      );
      i++;
      continue;
    }

    // Numbered list (1. 2. etc.)
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      children.push(
        new Paragraph({
          children: parseInlineMarkdown(numberedMatch[2], { size: 22 }),
          numbering: { reference: 'default-numbering', level: 0 },
          spacing: { after: 40 },
        })
      );
      i++;
      continue;
    }

    // Sub-bullet (  - )
    if (line.match(/^\s{2,}-\s/)) {
      const content = line.replace(/^\s+-\s/, '');
      children.push(
        new Paragraph({
          children: parseInlineMarkdown(content, { size: 22 }),
          bullet: { level: 1 },
          spacing: { after: 30 },
        })
      );
      i++;
      continue;
    }

    // Bullet list
    if (line.startsWith('- ')) {
      const content = line.substring(2);
      children.push(
        new Paragraph({
          children: parseInlineMarkdown(content, { size: 22 }),
          bullet: { level: 0 },
          spacing: { after: 40 },
        })
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      children.push(
        new Paragraph({
          children: parseInlineMarkdown(line.substring(2), { size: 22 }),
          indent: { left: convertInchesToTwip(0.4) },
          border: { left: { style: BorderStyle.SINGLE, size: 3, color: '1B4332', space: 8 } },
          spacing: { before: 80, after: 80 },
        })
      );
      i++;
      continue;
    }

    // Regular paragraph
    children.push(
      new Paragraph({
        children: parseInlineMarkdown(line, { size: 22 }),
        spacing: { after: 60 },
      })
    );
    i++;
  }

  return new Document({
    numbering: {
      config: [{
        reference: 'default-numbering',
        levels: [{
          level: 0,
          format: 'decimal',
          text: '%1.',
          alignment: AlignmentType.START,
        }],
      }],
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
          },
        },
      },
      children,
    }],
  });
}

/** Convert markdown to docx and trigger download */
export async function downloadMarkdownAsDocx(markdown: string, filename: string, title?: string) {
  const doc = markdownToDocx(markdown, title);
  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename.endsWith('.docx') ? filename : `${filename}.docx`);
}
