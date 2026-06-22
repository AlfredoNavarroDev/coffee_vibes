import { PaymentResult } from "@/components/store/payment-result";

export default async function OrderPendingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PaymentResult status="pending" orderId={id} />;
}
