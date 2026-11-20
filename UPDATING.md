# Updating the upstream version

The upstream is the `jlesage/makemkv` Docker image, which bundles MakeMKV, pinned by tag.

## Determining the upstream version

The pin is `images.makemkv.source.dockerTag` in `startos/manifest/index.ts`. The newest release:

```bash
gh release view -R jlesage/docker-makemkv --json tagName -q .tagName
```

## Applying the bump

Set `dockerTag` to `jlesage/makemkv:<tag>`, keeping the tag's leading `v`. Set `version` in
`startos/versions/current.ts` to the same number without the `v` and without leading zeros in any
segment (tag `v26.09.2` is version `26.9.2:0`). Confirm the tag is published for `amd64` with
`docker manifest inspect jlesage/makemkv:<tag>`.
