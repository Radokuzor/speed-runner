/*global chrome*/
import React, { useEffect, useState } from "react";
import "./App.css";

import { Box, Button, Container, Grid, Chip, TextField } from "@mui/material";

import AutorenewIcon from "@mui/icons-material/Autorenew";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "sk-AW1T2IUvaBF0eResCHn1T3BlbkFJgv2IoG0",
  dangerouslyAllowBrowser: true
});

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  let count = 0;

  // Define all possible keywords
  const allKeywords = ["Property Address:", "Monthly Payment:", "Pet Policy:", "Smoking Policy:", "Utilities:", "Association Approval:", "Maintenance:"];

  useEffect(() => {
    const fetchData = () => {
      // Listen for messages from the background script
      chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.action === "updateSelectedText") {
          const updatedSelectedText = request.selectedText.data;
          console.log("Updated selected text in app.js:", updatedSelectedText.data);
          count++;
          if (updatedSelectedText) {
            setSelectedText(updatedSelectedText);
            setPrompt(updatedSelectedText);
            handleSubmit("Summarize this paragraph easy enough for a 5th grader to understand and in as few words as possible: ", updatedSelectedText);
            console.log("trying to request selectedText in app.js selectedTxt = ", updatedSelectedText);
          } else if (count < 10) {
            // If selectedTextData is empty or undefined, wait and fetch again
            setTimeout(fetchData, 1000); // Adjust the delay as needed
          }
        }
      });
    }
  fetchData();
  }, []); 


  useEffect(() => {
  const fetchData = () => {
    // Request selected text from background.js
    chrome.runtime.sendMessage({ message: "setSelectedText" }, function(response) {
      const selectedTextData = response.selectedText.data;
      count++;
      if (selectedTextData) {
        setSelectedText(selectedTextData);
        setPrompt(selectedTextData);
        handleSubmit("Summarize this paragraph easy enough for a 5th grader to understand and in as few words as possible: ", selectedTextData);
        console.log("trying to request selectedText in app.js selectedTxt = ", selectedTextData);
      } else if (count < 25) {
        // If selectedTextData is empty or undefined, wait and fetch again
        setTimeout(fetchData, 1000); // Adjust the delay as needed
      }
    });
  };

  fetchData(); // Initial call to start fetching data
  }, []);

  

  async function handleSubmit(buttonQ = "", paragraph = "", isRealtorDoc = false, selectedKeywords = ["property address:"]) {
    setIsLoading(true);
   
    // Construct the dynamic question part based on selectedKeywords
    const dynamicQuestionPart = selectedKeywords.join(", ");

    // property address:, Lease Term: , monthly payment:, pet policy: smoking policy:, who is covering utilities:, association approval: and maintenance: information on this contract \n\n
    let backupPrompt = prompt === "" ? paragraph : prompt;
    console.log("here's the prompt", backupPrompt)

    const question = isRealtorDoc ? `${buttonQ} ${dynamicQuestionPart} information on this contract: ${backupPrompt}?` : `${buttonQ} ${backupPrompt}?`;
    
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": question }],
      max_tokens: 3000,
      temperature: 0.2,
    });
    console.log("here's the prompt", question)
    console.log("here's chats repsonse", chatCompletion.choices[0].message.content);

    setResponse(chatCompletion.choices[0].message.content);
    
    setIsLoading(false);
  }

  // Function to handle keyword selection toggle
  const toggleKeywordSelection = (keyword) => {
    setSelectedKeywords(prevSelectedKeywords =>
      prevSelectedKeywords.includes(keyword)
        ? prevSelectedKeywords.filter(kw => kw !== keyword)
        : [...prevSelectedKeywords, keyword]
    );
  };

  function formatParagraph(paragraph, keywords) {
  const regex = new RegExp(`(${keywords.join('|')})`, "gi");
  const parts = paragraph.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        if (keywords.some(keyword => new RegExp(keyword, "gi").test(part))) {
          // Keyword found, apply formatting
          return <React.Fragment key={index}><br /><strong><u>{part}</u></strong></React.Fragment>;
        } else {
          // Not a keyword, return normal text
          return part;
        }
      })}
    </>
  );
}


  return (
    <Container>
      <Box sx={{ width: "100%", mt: 4 }}>
        <Grid container>
          <Grid item xs={12}>
            <h1> Welcome to Smarter Reader</h1>
            <TextField
              fullWidth
              autoFocus
              label="Your text"
              variant="outlined"
              multiline
              rows={4}
              margin="normal"
              value={prompt}
              onChange={(e) => {
                setPrompt(e.target.value);
                // chrome.storage.local.set({ prompt: e.target.value });
              }}
            />

            <div style={{ margin: "20px 0" }}>
              {allKeywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onClick={() => toggleKeywordSelection(keyword)}
                  color={selectedKeywords.includes(keyword) ? "primary" : "default"}
                  variant="outlined"
                  style={{ margin: "5px" }}
                />
              ))}
            </div>
            <Grid container style={{ padding: '20px' }}>
              <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit("answer the following questions about this document:\n  what is the ", "", true, selectedKeywords)}
              disabled={isLoading}
              startIcon={
                isLoading && (
                  <AutorenewIcon
                    sx={{
                      animation: "spin 2s linear infinite",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(360deg)",
                        },
                        "100%": {
                          transform: "rotate(0deg)",
                        },
                      },
                    }}
                  />
                )
              }
            >
              Summarize Document
            </Button>
            </Grid>
            <Grid container style={{ padding: '20px' }}>
              <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit("Summarize this paragraph easy enough for a 5th grader to understand and in as few words as possible: ")}
              disabled={isLoading}
              startIcon={
                isLoading && (
                  <AutorenewIcon
                    sx={{
                      animation: "spin 2s linear infinite",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(360deg)",
                        },
                        "100%": {
                          transform: "rotate(0deg)",
                        },
                      },
                    }}
                  />
                )
              }
            >
              Explain Quick
            </Button>
            </Grid>

            <Grid container style={{ padding: '20px' }}>
              <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit("Explain this paragraph to me as though i were a 5th grader and help me understand it in detail as best as possible ")}
              disabled={isLoading}
              startIcon={
                isLoading && (
                  <AutorenewIcon
                    sx={{
                      animation: "spin 2s linear infinite",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(360deg)",
                        },
                        "100%": {
                          transform: "rotate(0deg)",
                        },
                      },
                    }}
                  />
                )
              }
            >
              Explain In Detail
            </Button>
            </Grid>

            <Grid container style={{ padding: '20px' }}>
              <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit("Give me a college level answer response to this free response question in as few words as possible: ")}
              disabled={isLoading}
              startIcon={
                isLoading && (
                  <AutorenewIcon
                    sx={{
                      animation: "spin 2s linear infinite",
                      "@keyframes spin": {
                        "0%": {
                          transform: "rotate(360deg)",
                        },
                        "100%": {
                          transform: "rotate(0deg)",
                        },
                      },
                    }}
                  />
                )
              }
            >
              Answer Free Response Question
            </Button>
            </Grid>
          </Grid>
          <Grid>
            <div style={{ fontFamily: 'Arial, sans-serif', fontSize: '1.5em', lineHeight: '1.6' }}>
               {formatParagraph(response, selectedKeywords)}
            </div>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;

//
//
//select the correct answer to the question from the multiple choice options and explain as though you were talking to a 5th grader and in as few words as possible why the answer is correct, here's the question and multiple choices: