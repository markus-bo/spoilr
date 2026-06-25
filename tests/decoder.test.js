const assert = require("node:assert/strict");
const decoder = require("../assets/decoder");

const picsumPuzzleUrl = "https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?url=aHR0cHM6Ly9waWNzdW0ucGhvdG9zL2lkLzIzNy8yMDAvMzAwLmpwZ18obm9fcHJldmlld180KV8obm9wPTYwKQ~~&cred=aHR0cHM6Ly9waWNzdW0ucGhvdG9zL2lkLzIzNy8yMDAvMzAw&credu=aHR0cHM6Ly9waWNzdW0ucGhvdG9z";
const picsumImageUrl = "https://www.jigsawexplorer.com/api/fetch?target=https%3A%2F%2Fpicsum.photos%2Fid%2F237%2F200%2F300.jpg";

function toJigsawBase64(value) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "~");
}


const picsumResult = decoder.resolveInput(picsumPuzzleUrl);
assert.equal(picsumResult.targetUrl, "https://picsum.photos/id/237/200/300.jpg");
assert.equal(picsumResult.imageUrl, picsumImageUrl);
assert.equal(picsumResult.pieceCount, "60");

assert.equal(
  decoder.resolveInput("https://example.com/photo.jpg").imageUrl,
  "https://www.jigsawexplorer.com/api/fetch?target=https%3A%2F%2Fexample.com%2Fphoto.jpg"
);

assert.equal(
  decoder.resolveInput("https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?img=https%3A%2F%2Fexample.com%2Fplain.jpg").imageUrl,
  "https://www.jigsawexplorer.com/api/fetch?target=https%3A%2F%2Fexample.com%2Fplain.jpg"
);

const urlSafeEncoded = toJigsawBase64("https://cdn.example.com/path/a+b/image.webp?size=large");
assert.equal(
  decoder.resolveInput(urlSafeEncoded).imageUrl,
  "https://www.jigsawexplorer.com/api/fetch?target=https%3A%2F%2Fcdn.example.com%2Fpath%2Fa%2Bb%2Fimage.webp%3Fsize%3Dlarge"
);

assert.throws(
  () => decoder.resolveInput("not a valid puzzle value"),
  /valid URL|Invalid character|decoded/i
);

console.log("decoder tests passed");
