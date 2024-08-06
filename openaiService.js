// src/openaiService.js

import axios from 'axios';

const API_KEY = 'sk-mEo1kbSE82_CBbNgM85xCoVj1ANAv2vyq6QnMmxx_xT3BlbkFJEos-wmepIOFfXCtHN4qsdd2YpTG59G19WpWfn1tiIA';

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

export const getOpenAIResponse = async (prompt) => {
  const response = await openai.post('/completions', {
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 100,
  });
  return response.data;
};
