# Unpuzzled

Unpuzzled is a static browser tool for resolving the public image URL from a Jigsaw Explorer puzzle link.

It runs entirely in the browser. There is no build step, server, package install, or tracking code.

## Features

- Resolves full Jigsaw Explorer player URLs that contain `url=` or `img=`
- Accepts direct `http` and `https` image URLs
- Accepts encoded puzzle image values
- Removes Jigsaw mystery-puzzle metadata such as `_(no_preview_4)_...`
- Shows the resolved image through the Jigsaw Explorer fetch endpoint

The decoder mirrors the player script behavior from `jigex-prog.js`: it URI-decodes the value, treats values starting with `http` as plain URLs, otherwise applies the Jigsaw URL-safe Base64 replacements before decoding, removes custom mystery metadata, and wraps the clean target URL with:

```text
https://www.jigsawexplorer.com/api/fetch?target=
```

## Use Locally

Open `index.html` in a browser, paste a puzzle player URL, and press Reveal.

You can also pass a puzzle URL into the page query string:

```text
index.html?url=https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?url=...
```

## Test

The decoder tests run with Node.js and do not require dependencies.

```sh
node tests/decoder.test.js
```

## Contributing

Contributions are welcome. Start with [CONTRIBUTING.md](CONTRIBUTING.md) for local development, testing, and pull request expectations.

Please also read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) and [SECURITY.md](SECURITY.md).

## License

This project is licensed under the [MIT License](LICENSE).

Jigsaw Explorer, LinkedIn, and GitHub names and logos are trademarks of their respective owners. This project is not affiliated with Jigsaw Explorer.
