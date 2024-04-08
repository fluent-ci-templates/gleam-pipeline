use extism_pdk::*;
use fluentci_pdk::dag;

#[plugin_fn]
pub fn check(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("check")?
        .pkgx()?
        .with_packages(vec!["gleam", "escript"])?
        .with_exec(vec!["gleam", "deps", "download"])?
        .with_exec(vec!["gleam", "check", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn format(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("format")?
        .pkgx()?
        .with_packages(vec!["gleam", "escript"])?
        .with_exec(vec!["gleam", "deps", "download"])?
        .with_exec(vec!["gleam", "format", "--check", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn test(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("test")?
        .pkgx()?
        .with_packages(vec!["gleam", "escript"])?
        .with_exec(vec!["gleam", "deps", "download"])?
        .with_exec(vec!["gleam", "test", &args])?
        .stdout()?;
    Ok(stdout)
}

#[plugin_fn]
pub fn build(args: String) -> FnResult<String> {
    let stdout = dag()
        .pipeline("build")?
        .pkgx()?
        .with_packages(vec!["gleam", "escript"])?
        .with_exec(vec!["gleam", "deps", "download"])?
        .with_exec(vec!["gleam", "build", &args])?
        .stdout()?;
    Ok(stdout)
}
