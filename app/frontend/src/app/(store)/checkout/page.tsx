import { CheckoutView } from "@/components/store/checkout-view";

export const metadata = { title: "Checkout — Coffee Vibes" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
        Último paso
      </p>
      <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
        Confirma tu pedido
      </h1>
      <div className="mt-8">
        <CheckoutView />
      </div>
    </div>
  );
}
