import { expect, test } from "@rstest/core";

import { REQUEST_MODE_MODELS } from "@/core/cloudagent/mode-model";
import {
  getResolvedMode,
  reasoningEffortForMode,
} from "@/core/models/reasoning";

test("request-scoped modes remain selectable without a model catalog", () => {
  const model = REQUEST_MODE_MODELS[0];
  for (const mode of ["flash", "thinking", "pro", "ultra"] as const) {
    expect(getResolvedMode(mode, model)).toBe(mode);
  }
  expect(reasoningEffortForMode("pro", model)).toBe("medium");
  expect(reasoningEffortForMode("ultra", model)).toBe("high");
});
