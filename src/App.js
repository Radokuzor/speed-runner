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

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "saveText") {
    console.log("call saveText from app.js with msg:", message.text);
    setPrompt(message.text);
    handleSubmit(message.text)
  } else if (message.action === "checkText") {

  }
  });
  

  // useEffect(() => {
  //   try {
  //     chrome.storage.local.get(null, function (data) {
  //       if ("prompt" in data) {
  //         setPrompt(data.prompt);
  //       }
  //     });
  //   } catch (e) {
  //     console.log("Error due to local state");
  //   }
  // }, []);

  async function handleSubmit(text = "") {
    setIsLoading(true);
    let excerpt = text === "" ? prompt : text;
    console.log("here's the excerpt", excerpt)
    const question = `Summarize this paragraph easy enough for a 5th grader and in as few words as possible: ${excerpt}?`;
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
            <h1> Welcome to smarter reader</h1>
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
            <Button
              fullWidth
              disableElevation
              variant="contained"
              onClick={() => handleSubmit()}
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
              Submit
            </Button>
          </Grid>
          <Grid>
            <p>{response}</p>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
