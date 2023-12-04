let savedTexts = [];

chrome.runtime.onInstalled.addListener(() => {
  console.log("Text Saver extension installed!");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveText") {
    // saveText(message.text);
  } else if (message.action === "checkText") {
    sendResponse(savedTexts);
  }
});

async function saveText(text) {
  // send to chat 
  const apiKey = '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';
  const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';

  try {
    const question = `Summarize this paragraph for me in simpler terms: ${text}?`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: question,
        max_tokens: 50,  // Adjust as needed
      }),
    });

    console.log('Here is the prompt:', question);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if 'choices' property is present and has at least one element
    const chatGptResponse = data.choices && data.choices.length > 0
      ? data.choices[0].text
      : 'No response from ChatGPT';

    // Optionally, you can do something with the ChatGPT response, such as log it or display it.\
    
    console.log('ChatGPT Response:', chatGptResponse);

    // Notify the popup to update with the latest saved texts
    savedTexts = []
    savedTexts.push(chatGptResponse);
    console.log('saved Texts:', savedTexts);
    chrome.runtime.sendMessage({ action: "updatePopup", texts: savedTexts});
  } catch (error) {
    console.error('Error fetching from ChatGPT API:', error.message);

    // Handle the error as needed
    chrome.runtime.sendMessage({ action: "updatePopup", texts: 'Error fetching from ChatGPT API' });
  }
}

