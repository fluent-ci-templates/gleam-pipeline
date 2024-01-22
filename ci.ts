import {
  check,
  format,
  test,
  build,
} from "https://pkg.fluentci.io/gleam_pipeline@v0.6.1/mod.ts";

await check();
await format();
await test();
await build();
