(function () {
  "use strict";

  var REQUIRED_PUZZLE_URL_PREFIX = "www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?url=";

  var pageShell = document.getElementById("page-shell");
  var form = document.getElementById("resolver-form");
  var input = document.getElementById("puzzle-input");
  var startButton = document.getElementById("start-button");
  var formError = document.getElementById("form-error");
  var outputPanel = document.getElementById("output-panel");
  var previewImage = document.getElementById("preview-image");
  var outputMessage = document.getElementById("output-message");

  function setButtonLoading(isLoading) {
    startButton.disabled = isLoading;
    startButton.textContent = isLoading ? "Loading" : "Reveal";
  }

  function clearImage() {
    previewImage.hidden = true;
    outputPanel.dataset.fit = "contain";
    previewImage.removeAttribute("src");
  }

  function hideFormError() {
    formError.hidden = true;
    formError.textContent = "";
  }

  function showFormError(message) {
    pageShell.dataset.view = "start";
    outputPanel.hidden = true;
    outputPanel.dataset.state = "empty";
    outputPanel.setAttribute("aria-busy", "false");
    clearImage();
    formError.hidden = false;
    formError.textContent = message;
  }

  function showMessage(state, message) {
    hideFormError();
    pageShell.dataset.view = "output";
    outputPanel.hidden = false;
    outputPanel.dataset.state = state;
    outputPanel.setAttribute("aria-busy", state === "loading" ? "true" : "false");
    clearImage();
    outputMessage.hidden = false;
    outputMessage.textContent = message;
  }

  function showImage(url) {
    hideFormError();
    pageShell.dataset.view = "output";
    outputPanel.hidden = false;
    outputPanel.dataset.state = "loading";
    outputPanel.setAttribute("aria-busy", "true");
    outputMessage.hidden = false;
    outputMessage.textContent = "Loading image.";
    clearImage();
    previewImage.src = url;
  }

  function resolvePuzzleUrl(value) {
    var trimmedValue = value.trim();
    var comparableValue = trimmedValue.replace(/^https?:\/\//i, "");

    if (!comparableValue.startsWith(REQUIRED_PUZZLE_URL_PREFIX)) {
      setButtonLoading(false);
      showFormError("Enter a Jigsaw Explorer puzzle URL that starts with " + REQUIRED_PUZZLE_URL_PREFIX);
      input.focus();
      return;
    }

    var result = window.PuzzleImageDecoder.resolveInput(trimmedValue);
    showImage(result.imageUrl);
  }

  function puzzleUrlFromPageParams() {
    var params = new URLSearchParams(window.location.search);
    return params.get("url") || params.get("puzzle") || "";
  }

  function resolvePageParamUrl() {
    var puzzleUrl = puzzleUrlFromPageParams().trim();
    if (!puzzleUrl) {
      return;
    }

    input.value = puzzleUrl;
    hideFormError();
    setButtonLoading(true);

    try {
      resolvePuzzleUrl(puzzleUrl);
    } catch (error) {
      setButtonLoading(false);
      showMessage("error", "That did not work. " + error.message);
      input.focus();
    }
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    hideFormError();
    setButtonLoading(true);

    try {
      resolvePuzzleUrl(input.value);
    } catch (error) {
      setButtonLoading(false);
      showMessage("error", "That did not work. " + error.message);
      input.focus();
    }
  });

  previewImage.addEventListener("load", function () {
    outputPanel.dataset.state = "loaded";
    outputPanel.dataset.fit = "contain";
    outputPanel.setAttribute("aria-busy", "false");
    outputMessage.hidden = true;
    previewImage.hidden = false;
    setButtonLoading(false);
  });

  previewImage.addEventListener("error", function () {
    setButtonLoading(false);
    showMessage("error", "That did not work. The picture could not be loaded from this URL.");
  });

  previewImage.addEventListener("click", function () {
    if (outputPanel.dataset.state !== "loaded") {
      return;
    }

    outputPanel.dataset.fit = outputPanel.dataset.fit === "zoom" ? "contain" : "zoom";
  });

  resolvePageParamUrl();
})();
