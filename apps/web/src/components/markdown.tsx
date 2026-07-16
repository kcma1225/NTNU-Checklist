import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

// Raw HTML is never enabled (no rehype-raw), so this can safely render editor-authored
// content without an XSS review — only CommonMark + GFM syntax is interpreted.
const blockComponents: Components = {
  h1: ({ children }) => <h3 className="mt-4 mb-1.5 text-lg font-semibold first:mt-0">{children}</h3>,
  h2: ({ children }) => <h4 className="mt-4 mb-1.5 text-base font-semibold first:mt-0">{children}</h4>,
  h3: ({ children }) => <h5 className="mt-3 mb-1 text-sm font-semibold first:mt-0">{children}</h5>,
  h4: ({ children }) => <h6 className="mt-3 mb-1 text-sm font-medium first:mt-0">{children}</h6>,
  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
  ul: ({ children }) => <ul className="mb-2 list-disc space-y-0.5 pl-5 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-2 list-decimal space-y-0.5 pl-5 last:mb-0">{children}</ol>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2 hover:no-underline"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  code: ({ children }) => (
    <code className="rounded bg-muted px-1 py-0.5 font-mono text-[0.85em]">{children}</code>
  ),
};

// Same overrides, but `p` collapses to a `span` since inline usage (e.g. a checklist <li>)
// is already inside a flex/block container that shouldn't get a nested block element.
const inlineComponents: Components = {
  ...blockComponents,
  p: ({ children }) => <span>{children}</span>,
};

export function Markdown({
  children,
  inline = false,
  className,
}: {
  children: string;
  inline?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("text-sm leading-relaxed", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={inline ? inlineComponents : blockComponents}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
