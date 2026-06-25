# Contributing

Thanks for considering a contribution to *spoilr*.

## Project Scope

*spoilr* is intentionally small:

- Static HTML, CSS, and JavaScript
- No build system
- No runtime dependencies
- No analytics or server-side code

Changes should keep that simplicity unless there is a clear benefit.

## Local Development

Open `index.html` in a browser. No local server is required for normal use.

If you prefer a server, any static file server works, for example:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Tests

Run the decoder tests before opening a pull request:

```sh
node tests/decoder.test.js
```

Please add or update tests when changing URL parsing, decoding, validation, or metadata stripping behavior.

## Pull Requests

Before submitting a pull request:

- Keep the change focused on one issue or improvement.
- Explain the user-visible behavior change.
- Include screenshots for UI changes.
- Confirm the decoder tests pass.
- Avoid adding dependencies unless the benefit is strong and documented.

## Style

- Use plain JavaScript compatible with current browsers.
- Keep code readable without a transpiler.
- Prefer clear error messages over silent failures.
- Keep comments brief and useful.
