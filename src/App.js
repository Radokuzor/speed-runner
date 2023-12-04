/*global chrome*/
import React, { useEffect, useState } from "react";
import "./App.css";

import { Box, Button, Container, Grid, Paper, TextField } from "@mui/material";

import AutorenewIcon from "@mui/icons-material/Autorenew";

import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: "",
  dangerouslyAllowBrowser: true
});

function updatePopup(text) {
  const savedTextList = document.getElementById("savedTextList");
  savedTextList.innerHTML = text;

  // texts.forEach((text) => {
  //   const listItem = document.createElement("li");
  //   listItem.textContent = text;
  //   savedTextList.appendChild(listItem);
  // });
}

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  useEffect(() => {
    try {
      chrome.storage.local.get(null, function (data) {
        if ("prompt" in data) {
          setPrompt(data.prompt);
        }
      });
    } catch (e) {
      console.log("Error due to local state");
    }
  }, []);

  async function handleSubmit() {
    setIsLoading(true);

    const question = `Summarize this paragraph easy enough for a 5th grader and in as few words as possible: ${prompt}?`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ "role": "user", "content": question }],
      max_tokens: 3000,
      temperature: 0.2,
    });
    console.log(chatCompletion.choices[0].message);

    setResponse(chatCompletion.choices[0].message.content);
    console.log(chatCompletion);
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
