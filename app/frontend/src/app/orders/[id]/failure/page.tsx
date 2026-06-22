import { PaymentResult } from "@/components/store/payment-result";

export default async function OrderFailurePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PaymentResult status="failure" orderId={id} />;
}
