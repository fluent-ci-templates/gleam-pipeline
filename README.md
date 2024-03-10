# Gleam Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fgleam_pipeline&query=%24.version)](https://pkg.fluentci.io/gleam_pipeline)
[![deno module](https://shield.deno.dev/x/gleam_pipeline)](https://deno.land/x/gleam_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://img.shields.io/badge/dagger-v0.10.0-blue?color=3D66FF&labelColor=000000)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/gleam)](https://jsr.io/@fluentci/gleam)
[![codecov](https://img.shields.io/codecov/c/gh/fluent-ci-templates/gleam-pipeline)](https://codecov.io/gh/fluent-ci-templates/gleam-pipeline)
[![ci](https://github.com/fluent-ci-templates/gleam-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/fluent-ci-templates/gleam-pipeline/actions/workflows/ci.yml)

A ready-to-use CI/CD Pipeline for your [Gleam](https://gleam.run) projects.

## 🚀 Usage

Run the following command:

```bash
fluentci run gleam_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t gleam
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

Or simply:

```bash
fluentci
```

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger install github.com/fluent-ci-templates/gleam-pipeline@main
```

Call a function from the module:

```bash
dagger -m github.com/fluent-ci-templates/gleam-pipeline@main call \
  check --src .

dagger -m github.com/fluent-ci-templates/gleam-pipeline@main call \
  format --src .

dagger -m github.com/fluent-ci-templates/gleam-pipeline@main call \
  test --src .

dagger -m github.com/fluent-ci-templates/gleam-pipeline@main call \
  build --src .
```

## ✨ Jobs

| Job    | Description         |
| ------ | ------------------- |
| check  | Run type checking   |
| format | Format source code  |
| test   | Run the tests       |
| build  | Build the project   |

```typescript
check(
  src: Directory | string | undefined = "."
): Promise<string>

format(
  src: Directory | string | undefined = "."
): Promise<Directory | string>

test(
  src: Directory | string | undefined = "."
): Promise<string>

build(
  src: Directory | string | undefined = "."
): Promise<Directory | string>
```

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```ts
import { check, format, test, build } from "jsr:@fluentci/gleam";

await check();
await format();
await test();
await build();
```
