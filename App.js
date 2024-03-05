/*global chrome*/
import React, { useEffect, useState } from "react";
import "./App.css";

import { Box, Button, Container, Grid, Paper, TextField } from "@mui/material";

import AutorenewIcon from "@mui/icons-material/Autorenew";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [selectedText, setSelectedText] = useState("");
  let count = 0;

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

  async function handleSubmit(buttonQ = "", paragraph = "") {
    setIsLoading(true);
    let backupPrompt = prompt === "" ? paragraph : prompt;
    console.log("here's the prompt", backupPrompt)
    const question = `${buttonQ} ${backupPrompt}?`;
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

  return (
    <Container>
      <Box sx={{ width: "100%", mt: 4 }}>
        <Grid container>
          <Grid item xs={12}>
            <h1> Realtor Copilot</h1>
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
            <Grid container style={{ padding: '20px' }}>
              <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit("Assume you are a great real estate blog writer, write an SEO optimized blog about: ")}
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
              Blog Writer
            </Button>
            </Grid>
             <Grid container style={{ padding: '20px' }}>
              <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit("assume you are a real estate agent, suggest the answers to these questions: ")}
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
              Market intelligence
            </Button>
            </Grid>
            <Grid container style={{ padding: '20px' }}>
              <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit("respond to this email above like a real estate agent called John Doe: ")}
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
              Respond to email
            </Button>
            </Grid>

            <Grid container style={{ padding: '20px' }}>
              <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit("Write an SEO optimized attention-grabbing listing description for this property: ")}
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
              Listing Description
            </Button>
            </Grid>

            <Grid container style={{ padding: '20px' }}>
              <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit("Summarize this document in 5 sentences: ")}
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
              Lease Summarizer
            </Button>
            </Grid>
          </Grid>
          <Grid>
            <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '1.5em', lineHeight: '1.6' }}>{response}</p>

            {/* <p>{response}</p> */}
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