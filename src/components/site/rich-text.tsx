/**
 * Renders admin-authored multi-paragraph text safely: blank lines become real paragraph
 * breaks, but stray single line breaks (e.g. from pasting out of a PDF or Word doc, where
 * every line wraps at ~40-60 characters) collapse into normal reflow instead of being
 * preserved literally — which is what causes short, jagged "hanging" lines in narrow columns.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\r?\n/g, " ").trim())
    .filter(Boolean);

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className={className}>
          {paragraph}
        </p>
      ))}
    </>
  );
}
