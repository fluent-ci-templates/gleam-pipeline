import Client, { connect } from "https://sdk.fluentci.io/v0.1.9/mod.ts";
import {
  check,
  format,
  test,
  build,
} from "https://pkg.fluentci.io/gleam_pipeline@v0.3.3/mod.ts";

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await check(client, src);
    await format(client, src);
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
