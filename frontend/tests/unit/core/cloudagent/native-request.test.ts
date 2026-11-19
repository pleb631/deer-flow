import { afterEach, expect, rs, test } from "@rstest/core";

import { clearRequestModel, setRequestModel } from "@/cloudagent/model";
import { prepareNativeRequest } from "@/cloudagent/native-request";

afterEach(() => { clearRequestModel(); rs.restoreAllMocks(); });

test("keeps native paths and sends model credentials only in the request header", async () => {
  const model = { name: "request-model", base_url: "https://model.example/v1", api_key: "test-request-secret" };
  setRequestModel(model);
  rs.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { headers: { "X-CloudAgent-Default-Agent": "cloudagent" } }));
  const url = new URL("http://localhost:3000/api/langgraph/threads/thread/runs/stream");
  const result = await prepareNativeRequest(url, { method: "POST", body: JSON.stringify({ assistant_id: "lead_agent", input: { messages: [] } }) });
  expect(url.pathname).toBe("/api/langgraph/threads/thread/runs/stream");
  expect(JSON.parse(decodeURIComponent(new Headers(result.headers).get("X-CloudAgent-Model")!))).toEqual(model);
  expect(typeof result.body).toBe("string");
  const body = result.body as string;
  expect(body).not.toContain(model.api_key);
  expect(JSON.parse(body)).toMatchObject({ assistant_id: "cloudagent", on_disconnect: "cancel", context: { model_name: "cloudagent-dynamic" } });
  const read = await prepareNativeRequest(url, { method: "GET" });
  expect(new Headers(read.headers).has("X-CloudAgent-Model")).toBe(false);
});

test("requires a model for native runs", async () => {
  await expect(prepareNativeRequest(new URL("http://localhost/api/threads/thread/runs/stream"), { method: "POST", body: "{}" })).rejects.toThrow();
});
