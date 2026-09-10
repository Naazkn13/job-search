import { NEXT_LOCAL_API_URL } from "@/lib/api";

/** @type {import('next').RouteHandler} */
export async function GET() {
  try {
    const res = await fetch(`${NEXT_LOCAL_API_URL}/health`, {
      cache: "no-store",
    });
    if (!res.ok) {
      return Response.json({ error: "backend-unhealthy" }, { status: res.status });
    }
    return Response.json(await res.json());
  } catch (err) {
    return Response.json({ error: "backend-unreachable" }, { status: 502 });
  }
}
