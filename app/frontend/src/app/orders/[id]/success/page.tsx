import { PaymentResult } from "@/components/store/payment-result";

export default async function OrderSuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PaymentResult status="success" orderId={id} />;
}
