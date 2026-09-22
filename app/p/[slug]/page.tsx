import { SandboxedPreview } from "@/components/sandboxed-preview";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <SandboxedPreview
      title={slug}
      src={`/api/preview/${slug}`}
      className="h-screen w-full"
    />
  );
}
