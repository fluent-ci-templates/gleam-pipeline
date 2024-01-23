import { Writable } from "node:stream";
import { Client } from "./client.gen.ts";
import { Context } from "./context.ts";

/**
 * ConnectOpts defines option used to connect to an engine.
 */
export interface ConnectOpts {
  /**
   * Use to overwrite Dagger workdir
   * @defaultValue process.cwd()
   */
  Workdir?: string;
  /**
   * Enable logs output
   * @example
   * LogOutput
   * ```ts
   * connect(async (client: Client) => {
    const source = await client.host().workdir().id()
    ...
    }, {LogOutput: process.stdout})
    ```
   */
  LogOutput?: Writable;
}

export type CallbackFct = (client: Client) => Promise<void>;

export interface ConnectParams {
  port: number;
  session_token: string;
}

/**
 * connect runs GraphQL server and initializes a
 * GraphQL client to execute query on it through its callback.
 * This implementation is based on the existing Go SDK.
 */
export async function connect(
  cb: CallbackFct,
  _config: ConnectOpts = {}
): Promise<void> {
<<<<<<< HEAD
  let client: Client;
  // let close: null | (() => void) = null;

  if (Deno.env.has("FLUENTCI_TOKEN") && Deno.env.has("FLUENTCI_SESSION_ID")) {
    const client = new Client({
      host: Deno.env.get("FLUENTCI_HOST") || "vm.fluentci.io",
      sessionToken: Deno.env.get("FLUENTCI_TOKEN"),
    });
    await cb(client).finally(() => {
      if (close) {
        close();
      }
    });
    return;
  }
=======
  const ctx = new Context();
  const client = new Client({ ctx: ctx });
>>>>>>> a55626d (update sdk dir)

  // Initialize connection
  await ctx.connection();

<<<<<<< HEAD
    if (config.Workdir && config.Workdir !== "") {
      throw new Error(
        "cannot configure workdir for existing session (please use --workdir or host.directory with absolute paths instead)"
      );
    }

    client = new Client({
      host: `127.0.0.1:${daggerSessionPort}`,
      sessionToken: sessionToken,
    });
  } else {
    throw new Error("DAGGER_SESSION_PORT must be set");
  }

  await cb(client).finally(() => {
    if (close) {
      close();
    }
=======
  await cb(client).finally(() => {
    ctx.close();
>>>>>>> a55626d (update sdk dir)
  });
}
