import {
  check,
  format,
  test,
  build,
} from "https://pkg.fluentci.io/gleam_pipeline@v0.4.0/mod.ts";

await check();
await format();
await test();
await build();
