# Gleam Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fgleam_pipeline&query=%24.version)](https://pkg.fluentci.io/gleam_pipeline)
[![deno module](https://shield.deno.dev/x/gleam_pipeline)](https://deno.land/x/gleam_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![codecov](https://img.shields.io/codecov/c/gh/fluent-ci-templates/gleam-pipeline)](https://codecov.io/gh/fluent-ci-templates/gleam-pipeline)

A ready-to-use CI/CD Pipeline for your [Gleam](https://gleam.org) projects.

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci gleam_pipeline
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

## Jobs

| Job    | Description         |
| ------ | ------------------- |
| check  | Run type checking   |
| format | Format source code  |
| test   | Run the tests       |
| build  | Build the project   |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://pkg.fluentci.io/gleam_pipeline/mod.ts";

const { check, format, test, build } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await check(client, src);
    await format(client, src);
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
```
