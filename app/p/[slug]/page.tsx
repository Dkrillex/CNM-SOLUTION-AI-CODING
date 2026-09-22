export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <iframe
      title={slug}
      src={`/api/preview/${slug}`}
      className="h-screen w-full border-0 bg-background"
    />
  );
}
