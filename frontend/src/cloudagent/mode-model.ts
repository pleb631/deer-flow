import type { Model } from "@/core/models/types";

// Mode selection is open for request-scoped models. The caller chooses a
// compatible provider; this is a UI policy, not a detected model capability.
export const REQUEST_MODE_MODELS: Model[] = [
  {
    id: "cloudagent-dynamic",
    name: "cloudagent-dynamic",
    model: "run-scoped",
    display_name: "请求模型",
    supports_thinking: true,
    supports_reasoning_effort: true,
  },
];
