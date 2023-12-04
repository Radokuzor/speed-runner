chrome.runtime.sendMessage({ action: "checkText" });

document.addEventListener("mouseup", async (event) => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText !== "") {
    chrome.runtime.sendMessage({ action: "saveText", text: selectedText });
  }
});
