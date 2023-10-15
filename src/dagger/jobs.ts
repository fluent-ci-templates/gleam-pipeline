import Client, { connect, withDevbox } from "../../deps.ts";

export enum Job {
  check = "check",
  format = "format",
  test = "test",
  build = "build",
}

export const exclude = [".git", ".devbox", ".fluentci", "build"];

export const check = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = withDevbox(
      client
        .pipeline(Job.check)
        .container()
        .from("alpine:latest")
        .withExec(["apk", "update"])
        .withExec(["apk", "add", "curl", "bash"])
        .withMountedCache("/nix", client.cacheVolume("nix"))
        .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
    )
      .withMountedCache(
        "/root/.local/share/devbox/global",
        client.cacheVolume("devbox-global")
      )
      .withExec(["devbox", "global", "add", "gleam", "erlang", "rebar3"])
      .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
      .withMountedCache("/app/build", client.cacheVolume("gleam-build"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec([
        "sh",
        "-c",
        'eval "$(devbox global shellenv)" && gleam check',
      ]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
};

export const format = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = withDevbox(
      client
        .pipeline(Job.format)
        .container()
        .from("alpine:latest")
        .withExec(["apk", "update"])
        .withExec(["apk", "add", "curl", "bash"])
        .withMountedCache("/nix", client.cacheVolume("nix"))
        .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
    )
      .withMountedCache(
        "/root/.local/share/devbox/global",
        client.cacheVolume("devbox-global")
      )
      .withExec(["devbox", "global", "add", "gleam", "erlang", "rebar3"])
      .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
      .withMountedCache("/app/build", client.cacheVolume("gleam-build"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec([
        "sh",
        "-c",
        `eval "$(devbox global shellenv)" && gleam deps download`,
      ])
      .withExec([
        "sh",
        "-c",
        'eval "$(devbox global shellenv)" && gleam format --check src test',
      ]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
};

export const test = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = withDevbox(
      client
        .pipeline(Job.test)
        .container()
        .from("alpine:latest")
        .withExec(["apk", "update"])
        .withExec(["apk", "add", "curl", "bash"])
        .withMountedCache("/nix", client.cacheVolume("nix"))
        .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
    )
      .withMountedCache(
        "/root/.local/share/devbox/global",
        client.cacheVolume("devbox-global")
      )
      .withExec(["devbox", "global", "add", "gleam", "erlang", "rebar3"])
      .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
      .withMountedCache("/app/build", client.cacheVolume("gleam-build"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec([
        "sh",
        "-c",
        `eval "$(devbox global shellenv)" && gleam deps download`,
      ])
      .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && gleam test']);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
};

export const build = async (src = ".") => {
  await connect(async (client: Client) => {
    const context = client.host().directory(src);
    const ctr = withDevbox(
      client
        .pipeline(Job.build)
        .container()
        .from("alpine:latest")
        .withExec(["apk", "update"])
        .withExec(["apk", "add", "curl", "bash"])
        .withMountedCache("/nix", client.cacheVolume("nix"))
        .withMountedCache("/etc/nix", client.cacheVolume("nix-etc"))
    )
      .withMountedCache(
        "/root/.local/share/devbox/global",
        client.cacheVolume("devbox-global")
      )
      .withExec(["devbox", "global", "add", "gleam", "erlang", "rebar3"])
      .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
      .withMountedCache("/app/build", client.cacheVolume("gleam-build"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec([
        "sh",
        "-c",
        `eval "$(devbox global shellenv)" && gleam deps download`,
      ])
      .withExec([
        "sh",
        "-c",
        'eval "$(devbox global shellenv)" && gleam build',
      ]);

    const result = await ctr.stdout();

    console.log(result);
  });
  return "done";
};

export type JobExec = (src?: string) =>
  | Promise<string>
  | ((
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<string>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.build]: build,
  [Job.check]: check,
  [Job.format]: format,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.check]: "Run type checking",
  [Job.format]: "Format source code",
  [Job.test]: "Run tests",
  [Job.build]: "Build the project",
};
