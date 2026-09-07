export interface Env {}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { "content-type": "application/json" },
    });
  },
} satisfies ExportedHandler<Env>;
