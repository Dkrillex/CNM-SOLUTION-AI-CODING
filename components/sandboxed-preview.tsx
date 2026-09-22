import { cn } from "@/lib/utils";

/** Opaque origin: scripts can run, but they cannot read this site's cookies or DOM. */
export const PREVIEW_SANDBOX = "allow-scripts allow-forms";

export function SandboxedPreview({
  title,
  src,
  srcDoc,
  className,
}: {
  title: string;
  src?: string;
  srcDoc?: string;
  className?: string;
}) {
  return (
    <iframe
      title={title}
      className={cn("border-0 bg-zinc-950", className)}
      sandbox={PREVIEW_SANDBOX}
      referrerPolicy="no-referrer"
      src={srcDoc ? undefined : src}
      srcDoc={srcDoc}
    />
  );
}
