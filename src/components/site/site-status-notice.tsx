import type { PlatformStatus } from "@/lib/website-status";

export function SiteStatusNotice({ status, status_message, maintenance_return_at }: PlatformStatus) {
  const isMaintenance = status === "maintenance";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-kida-purple px-4 py-16 text-center text-white">
      <h1 className="text-3xl font-bold">{isMaintenance ? "Site Under Maintenance" : "Site Unavailable"}</h1>
      <p className="mt-3 max-w-md text-white/80">
        {status_message ??
          (isMaintenance
            ? "We are currently performing scheduled maintenance. Please check back shortly."
            : "This site is temporarily unavailable. Please check back later.")}
      </p>
      {maintenance_return_at && (
        <p className="mt-2 text-sm text-white/60">Expected back: {new Date(maintenance_return_at).toLocaleString()}</p>
      )}
    </div>
  );
}
