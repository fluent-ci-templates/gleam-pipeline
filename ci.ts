import { check, format, test, build } from "jsr:@fluentci/gleam";

await check();
await format();
await test();
await build();
