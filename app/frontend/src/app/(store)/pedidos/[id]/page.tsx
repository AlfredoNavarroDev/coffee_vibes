import { RouteGuard } from "@/components/auth/route-guard";
import { OrderDetailView } from "@/components/store/order-detail-view";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <RouteGuard>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <OrderDetailView orderId={Number(id)} />
      </div>
    </RouteGuard>
  );
}
