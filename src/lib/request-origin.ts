import type { NextRequest } from "next/server";

/**
 * Public site origin for redirects (OAuth callback, middleware).
 * On Vercel, `request.url` can be an internal URL; prefer forwarded headers when present.
 */
export function getRequestOrigin(request: NextRequest | Request): string {
  const headers =
    "headers" in request ? request.headers : new Headers();

  const forwardedHost = headers.get("x-forwarded-host");
  const forwardedProto = headers.get("x-forwarded-proto");

  if (forwardedHost) {
    const host = forwardedHost.split(",")[0]?.trim() ?? forwardedHost;
    const proto = (forwardedProto ?? "https").split(",")[0]?.trim() ?? "https";
    return `${proto}://${host}`;
  }

  if ("nextUrl" in request && request.nextUrl) {
    return request.nextUrl.origin;
  }

  return new URL(request.url).origin;
}
