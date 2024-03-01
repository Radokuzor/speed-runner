
document.addEventListener("mouseup", async (event) => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText !== "") {
    chrome.runtime.sendMessage({ action: "setSelectedText", text: selectedText });
    chrome.storage.local.set({ 'selectedText': selectedText });
    console.log("selectedText set in content.js selectedText = ", selectedText)

    window.postMessage({
      type: "FROM_EXTENSION",
      text: selectedText
    }, "*");
  }
});
