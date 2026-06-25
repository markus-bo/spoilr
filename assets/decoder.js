(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.PuzzleImageDecoder = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var HTTP_URL_PATTERN = /^https?:\/\//i;
  var JIGSAW_FETCH_ORIGIN = "https://www.jigsawexplorer.com";
  var JIGSAW_FETCH_PATH = "/api/fetch";
  var JIGSAW_FETCH_PREFIX = JIGSAW_FETCH_ORIGIN + JIGSAW_FETCH_PATH + "?target=";
  var NO_PREVIEW_4_MARKER = "_(no_preview_4)_";
  var NO_PREVIEW_2_MARKER = "_(no_preview_2)_";

  function tryDecodeURIComponent(value) {
    try {
      return decodeURIComponent(value);
    } catch (_error) {
      return value;
    }
  }

  function cleanUrl(value) {
    return value.replace(/\\/g, "").trim();
  }

  function queryTextFromInput(input) {
    var trimmed = input.trim();

    try {
      var parsed = new URL(trimmed);
      return parsed.search ? parsed.search.slice(1) : "";
    } catch (_error) {
      var questionIndex = trimmed.indexOf("?");
      if (questionIndex !== -1) {
        var query = trimmed.slice(questionIndex + 1);
        var hashIndex = query.indexOf("#");
        return hashIndex === -1 ? query : query.slice(0, hashIndex);
      }

      if (/^(url|img)=/i.test(trimmed) || /(?:^|&)(url|img)=/i.test(trimmed)) {
        return trimmed;
      }
    }

    return "";
  }

  function extractPuzzleParam(input) {
    var query = queryTextFromInput(input);
    if (!query) {
      return null;
    }

    var parts = query.split("&");
    for (var index = 0; index < parts.length; index += 1) {
      var part = parts[index];
      if (!part) {
        continue;
      }

      var equalsIndex = part.indexOf("=");
      var rawKey = equalsIndex === -1 ? part : part.slice(0, equalsIndex);
      var rawValue = equalsIndex === -1 ? "" : part.slice(equalsIndex + 1);
      var key = tryDecodeURIComponent(rawKey).toLowerCase();

      if (key === "url" || key === "img") {
        return {
          key: key,
          value: rawValue
        };
      }
    }

    return null;
  }

  function decodeBase64(value) {
    var normalized = value
      .split("-").join("+")
      .split("_").join("/")
      .split("~").join("=")
      .replace(/\s+/g, "");

    var paddingNeeded = (4 - (normalized.length % 4)) % 4;
    normalized += "=".repeat(paddingNeeded);

    if (typeof atob === "function") {
      var binary = atob(normalized);
      if (typeof TextDecoder === "function") {
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i += 1) {
          bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder("utf-8").decode(bytes);
      }
      return binary;
    }

    if (typeof Buffer !== "undefined") {
      return Buffer.from(normalized, "base64").toString("utf8");
    }

    throw new Error("Base64 decoding is not available in this environment.");
  }

  function decodeJigsawValue(rawValue) {
    if (!rawValue || !rawValue.trim()) {
      throw new Error("No puzzle image value was found.");
    }

    var onceDecoded = tryDecodeURIComponent(rawValue.trim());
    if (HTTP_URL_PATTERN.test(onceDecoded)) {
      return cleanUrl(onceDecoded);
    }

    var twiceDecoded = tryDecodeURIComponent(onceDecoded);
    return cleanUrl(decodeBase64(twiceDecoded));
  }

  function validatePublicImageUrl(imageUrl) {
    var parsed;
    try {
      parsed = new URL(imageUrl);
    } catch (_error) {
      throw new Error("The decoded value is not a valid URL.");
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("The decoded URL must use http or https.");
    }

    return parsed;
  }

  function fetchTargetFromUrl(imageUrl) {
    var parsed;
    try {
      parsed = new URL(imageUrl);
    } catch (_error) {
      return "";
    }

    if (parsed.origin !== JIGSAW_FETCH_ORIGIN || parsed.pathname !== JIGSAW_FETCH_PATH) {
      return "";
    }

    return parsed.searchParams.get("target") || "";
  }

  function stripPuzzleMetadata(decodedUrl) {
    var targetUrl = decodedUrl;
    var markerIndex = targetUrl.indexOf(NO_PREVIEW_4_MARKER);

    if (markerIndex !== -1) {
      return targetUrl.slice(0, markerIndex);
    }

    markerIndex = targetUrl.indexOf(NO_PREVIEW_2_MARKER);
    if (markerIndex !== -1) {
      return targetUrl.slice(0, markerIndex);
    }

    return targetUrl;
  }

  function publicFetchUrl(targetUrl) {
    return JIGSAW_FETCH_PREFIX + encodeURIComponent(targetUrl);
  }

  function fileNameFromUrl(parsedUrl) {
    var path = parsedUrl.pathname || "";
    var segments = path.split("/").filter(Boolean);
    return tryDecodeURIComponent(segments[segments.length - 1] || parsedUrl.hostname);
  }

  function pieceCountFromUrl(imageUrl) {
    var patterns = [
      /(?:[?&]nop=|[\(_-]nop=)(\d+)/i,
      /(?:[?&]pieces=)(\d+)/i
    ];

    for (var index = 0; index < patterns.length; index += 1) {
      var match = imageUrl.match(patterns[index]);
      if (match) {
        return match[1];
      }
    }

    return "";
  }

  function sourceLabel(sourceType, key) {
    if (sourceType === "puzzle-param") {
      return "Puzzle parameter: " + key;
    }
    if (sourceType === "encoded") {
      return "Encoded value";
    }
    return "Direct image URL";
  }

  function resolveInput(input) {
    var trimmed = input.trim();
    if (!trimmed) {
      throw new Error("Enter a puzzle URL or encoded image value.");
    }

    var param = extractPuzzleParam(trimmed);
    var sourceType = param ? "puzzle-param" : "direct";
    var rawValue = param ? param.value : trimmed;
    var decodedProbe = tryDecodeURIComponent(rawValue);

    if (!param && !HTTP_URL_PATTERN.test(decodedProbe)) {
      sourceType = "encoded";
    }

    var decodedUrl = decodeJigsawValue(rawValue);
    var existingFetchTarget = fetchTargetFromUrl(decodedUrl);
    var targetUrl = stripPuzzleMetadata(existingFetchTarget || decodedUrl);
    var parsedTargetUrl = validatePublicImageUrl(targetUrl);
    var imageUrl = existingFetchTarget ? decodedUrl : publicFetchUrl(targetUrl);

    return {
      imageUrl: imageUrl,
      targetUrl: targetUrl,
      decodedUrl: decodedUrl,
      host: parsedTargetUrl.hostname,
      fileName: fileNameFromUrl(parsedTargetUrl),
      pieceCount: pieceCountFromUrl(decodedUrl),
      sourceType: sourceLabel(sourceType, param ? param.key : ""),
      rawValue: rawValue
    };
  }

  return {
    decodeJigsawValue: decodeJigsawValue,
    extractPuzzleParam: extractPuzzleParam,
    stripPuzzleMetadata: stripPuzzleMetadata,
    resolveInput: resolveInput
  };
});
