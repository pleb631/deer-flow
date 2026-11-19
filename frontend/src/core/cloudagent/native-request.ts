import { requestModelHeaders } from "./model";

let defaultAgent: Promise<string> | undefined;

function defaultAgentName() {
  defaultAgent ??= globalThis.fetch("/api/agents", { credentials: "include" })
    .then(response => {
      if (!response.ok) throw new Error("Failed to resolve default Agent");
      return response.headers.get("X-CloudAgent-Default-Agent") ?? "cloudagent";
    }).catch(error => { defaultAgent = undefined; throw error; });
  return defaultAgent;
}

export async function prepareNativeRequest(url: URL, init: RequestInit): Promise<RequestInit> {
  if (url.pathname.includes("/mock/")) return init;
  const createsRun = init.method === "POST" && /\/runs(?:\/stream|\/wait)?$/.test(url.pathname);
  const createsThread = init.method === "POST" && url.pathname.endsWith("/threads");
  const headers = new Headers(init.headers);
  if (createsRun) {
    Object.entries(requestModelHeaders(true)).forEach(([key, value]) => headers.set(key, value));
  }
  let body = init.body;
  if ((createsRun || createsThread) && typeof body === "string") {
    const payload = JSON.parse(body) as Record<string, unknown>;
    const context = payload.context as Record<string, unknown> | undefined;
    if (!context?.is_bootstrap && (!payload.assistant_id || payload.assistant_id === "lead_agent")) {
      payload.assistant_id = await defaultAgentName();
    }
    if (createsRun) {
      payload.context = { ...(payload.context as Record<string, unknown> ?? {}), model_name: "cloudagent-dynamic" };
      payload.on_disconnect = "cancel";
    }
    body = JSON.stringify(payload);
  }
  return { ...init, body, headers };
}
