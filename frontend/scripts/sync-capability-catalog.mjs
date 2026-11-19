import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { format, resolveConfig } from "prettier";

const source = new URL(
  "../../backend/packages/harness/deerflow/capabilities/builtin.json",
  import.meta.url,
);
const destination = new URL(
  "../src/core/capabilities/builtin.demo.json",
  import.meta.url,
);
const catalog = JSON.parse(await readFile(source, "utf8"));
for (const capability of catalog) {
  if (capability.kind === "native" && capability.setup) {
    capability.setup["en-US"] = capability.setup["en-US"]?.replace(
      /^This capability is supported by DeerFlow\./,
      "This capability is supported by 智汇万象.",
    );
    capability.setup["zh-CN"] = capability.setup["zh-CN"]?.replace(
      /^DeerFlow 已支持此能力。/,
      "智汇万象 已支持此能力。",
    );
  }
}
await writeFile(
  destination,
  await format(JSON.stringify(catalog), {
    ...(await resolveConfig(
      fileURLToPath(new URL("../package.json", import.meta.url)),
    )),
    parser: "json",
  }),
);
