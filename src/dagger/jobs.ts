/**
 * @module gleam
 * @description This module provides functions for Gleam projects
 */
import { Directory, dag } from "../../deps.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  check = "check",
  format = "format",
  test = "test",
  build = "build",
}

export const exclude = [".git", ".devbox", ".fluentci", "build"];

/**
 * Run type checking
 *
 * @function
 * @description Run type checking
 * @param {string | Directory} src
 * @returns {Promise<string>}
 */
export async function check(
  src: Directory | string | undefined = "."
): Promise<string> {
  const context = await getDirectory(src);
  const ctr = dag
    .pipeline(Job.check)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec(["pkgx", "install", "gleam", "escript"])
    .withMountedCache("/app/build", dag.cacheVolume("gleam-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["gleam", "deps", "download"])
    .withExec(["gleam", "check"]);

  return ctr.stdout();
}

/**
 * Format source code
 *
 * @function
 * @description Format source code
 * @param {string | Directory} src
 * @returns {Promise<Directory | string>}
 */
export async function format(
  src: Directory | string | undefined = "."
): Promise<Directory | string> {
  const context = await getDirectory(src);
  const ctr = dag
    .pipeline(Job.format)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec(["pkgx", "install", "gleam", "escript"])
    .withMountedCache("/app/build", dag.cacheVolume("gleam-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["gleam", "deps", "download"])
    .withExec(["gleam", "format", "--check", "src", "test"]);

  await ctr.stdout();
  return ctr.directory("/app/src").id();
}

/**
 * Run tests
 *
 * @function
 * @description Run tests
 * @param {string | Directory} src
 * @returns {Promise<string>}
 */
export async function test(
  src: Directory | string | undefined = "."
): Promise<string> {
  const context = await getDirectory(src);
  const ctr = dag
    .pipeline(Job.test)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec(["pkgx", "install", "gleam", "escript"])
    .withMountedCache("/app/build", dag.cacheVolume("gleam-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["gleam", "deps", "download"])
    .withExec(["gleam", "test"]);

  return ctr.stdout();
}

/**
 * Build the project
 *
 * @function
 * @description Build the project
 * @param {string | Directory} src
 * @returns {Promise<Direcotry | string>}
 */
export async function build(
  src: Directory | string | undefined = "."
): Promise<Directory | string> {
  const context = await getDirectory(src);
  const ctr = dag
    .pipeline(Job.build)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec(["pkgx", "install", "gleam", "escript"])
    .withMountedCache("/app/build", dag.cacheVolume("gleam-build"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["gleam", "build"])
    .withExec(["cp", "-r", "build", "/build"]);

  await ctr.stdout();
  return ctr.directory("/build").id();
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
