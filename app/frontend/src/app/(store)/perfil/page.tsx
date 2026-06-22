import { RouteGuard } from "@/components/auth/route-guard";
import { ProfileView } from "@/components/store/profile-view";

export const metadata = { title: "Mi perfil — Coffee Vibes" };

export default function ProfilePage() {
  return (
    <RouteGuard>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-tueste">
          Tu cuenta
        </p>
        <h1 className="mt-1 font-display text-3xl font-medium tracking-tight text-espresso sm:text-4xl">
          Mi perfil
        </h1>
        <div className="mt-8">
          <ProfileView />
        </div>
      </div>
    </RouteGuard>
  );
}
