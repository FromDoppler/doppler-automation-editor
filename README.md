# `Doppler Automation Editor` — MFE build

## CDN cleanup during deployment

The Jenkins publishing pipeline runs a CDN cleanup after uploading mutable packages such as `main`,
`INT`, and pull request builds. If the pipeline needs to run faster or the cleanup has to be skipped
temporarily, pass `--skip-clean` to `build-n-publish.sh`.

Example:

```sh
sh build-n-publish.sh \
    --package=${PKG_NAME} \
    --commit=${GIT_COMMIT} \
    --name=main \
    --skip-clean
```