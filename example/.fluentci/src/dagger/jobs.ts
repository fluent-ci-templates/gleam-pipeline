import { Client, Directory } from "../../sdk/client.gen.ts";
import { connect } from "../../sdk/connect.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  check = "check",
  format = "format",
  test = "test",
  build = "build",
}

export const exclude = [".git", ".devbox", ".fluentci", "build"];

export async function check(
  src: Directory | string | undefined = "."
): Promise<string> {
  let result = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = client
      .pipeline(Job.check)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec(["pkgx", "install", "gleam", "escript"])
      .withMountedCache("/app/build", client.cacheVolume("gleam-build"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["gleam", "deps", "download"])
      .withExec(["gleam", "check"]);

    result = await ctr.stdout();
  });
  return result;
}

export async function format(
  src: Directory | string | undefined = "."
): Promise<Directory | string> {
  let id = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = client
      .pipeline(Job.format)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec(["pkgx", "install", "gleam", "escript"])
      .withMountedCache("/app/build", client.cacheVolume("gleam-build"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["gleam", "deps", "download"])
      .withExec(["gleam", "format", "--check", "src", "test"]);

    await ctr.stdout();
    id = await ctr.directory("/app/src").id();
  });
  return id;
}

export async function test(
  src: Directory | string | undefined = "."
): Promise<string> {
  let result = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = client
      .pipeline(Job.test)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec(["pkgx", "install", "gleam", "escript"])
      .withMountedCache("/app/build", client.cacheVolume("gleam-build"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["gleam", "deps", "download"])
      .withExec(["gleam", "test"]);

    result = await ctr.stdout();
  });
  return result;
}

export async function build(
  src: Directory | string | undefined = "."
): Promise<Directory | string> {
  let id = "";
  await connect(async (client: Client) => {
    const context = getDirectory(client, src);
    const ctr = client
      .pipeline(Job.build)
      .container()
      .from("pkgxdev/pkgx:latest")
      .withExec(["apt-get", "update"])
      .withExec(["apt-get", "install", "-y", "ca-certificates"])
      .withExec(["pkgx", "install", "gleam", "escript"])
      .withMountedCache("/app/build", client.cacheVolume("gleam-build"))
      .withDirectory("/app", context, { exclude })
      .withWorkdir("/app")
      .withExec(["gleam", "build"])
      .withExec(["cp", "-r", "build", "/build"]);

    await ctr.stdout();
    id = await ctr.directory("/build").id();
  });
  return id;
}

export type JobExec = (
  src: Directory | string | undefined
) => Promise<Directory | string>;

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
