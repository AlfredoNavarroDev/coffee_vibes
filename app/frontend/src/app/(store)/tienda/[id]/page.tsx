import { ProductDetail } from "@/components/store/product-detail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <ProductDetail productId={Number(id)} />
    </div>
  );
}
