# Unpuzzled

Static debug tool for resolving the public image URL from a Jigsaw Explorer puzzle link.

## Use

Open `index.html` in a browser, paste a puzzle player URL, and press Start. The app shows the resolved picture or a clear error message. It accepts:

- Full player URLs with `url=` or `img=`
- Direct `http` or `https` image URLs
- Encoded puzzle image values

The decoder mirrors the player script behavior from `jigex-prog.js`: it URI-decodes the value, treats values starting with `http` as plain URLs, otherwise applies the Jigsaw URL-safe Base64 replacements before decoding, removes custom mystery metadata such as `_(no_preview_4)_...`, and wraps the clean target URL with:

```text
https://www.jigsawexplorer.com/api/fetch?target=
```

## Test

```sh
node tests/decoder.test.js
```
