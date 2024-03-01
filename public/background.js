let savedTexts = [];
let selectedText = "";

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    title: "Explain This",
    contexts: ["page","selection"],
    id: "openExtension"
  });
});

function handleDisconnect(port) {
  console.log("Port disconnected");

  // Attempt to establish a new connection
  const newPort = establishConnection();

  // Optionally, you can transfer any state or data from the old port to the new one
  // For example: newPort.state = port.state;
}

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "content-script");

  // Listen for disconnect events
  port.onDisconnect.addListener(function() {
    handleDisconnect(port);
  });

  // ... rest of the code
});


chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId === "openExtension") {
    console.log("popup opened")
    // chrome.windows.create({
    //   url: chrome.runtime.getURL("index.html"),
    //   type: "popup",
    //   width: 800,
    //   height: 600
    // });

     window.open("index.html", "Popup", "width=400,height=400");
  }
});

// Expose selectedText to content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === "setSelectedText") {
    console.log("getSelectedText call heard by background now send: selectedText = ", selectedText)
    sendResponse({ selectedText: selectedText });
  }
});


chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "content-script");

  // Listen for messages from the content script
  port.onMessage.addListener(function(message) {
    console.log("Received message in background script22:", message);
    selectedText = message;
    chrome.runtime.sendMessage({ action: "updateSelectedText", selectedText: selectedText });
    // Process the message and send a response if needed
    const response = { result: "Response from background script" };
    port.postMessage(response);
  });
});

chrome.runtime.onConnect.addListener(function(port) {
  console.assert(port.name === "content-script2");

  // Listen for messages from the content script
  port.onMessage.addListener(function(message) {
    console.log("Received message in background script22:", message);
    selectedText = message;
    chrome.runtime.sendMessage({ action: "updateSelectedText", selectedText: selectedText });
    // Process the message and send a response if needed
    const response = { result: "Response from background script" };
    port.postMessage(response);
  });
});

chrome.storage.onChanged.addListener(function(changes, area) {
  if (area === "local" && changes.selectedText) {
    let newText = changes.selectedText.newValue;
    console.log("New selected text received in background.js:", newText);
    // Additional handling code can go here
    chrome.runtime.sendMessage({ action: "updateSelectedText", selectedText: newText });
  }
});

// Additional background script logic
