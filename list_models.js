import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC1EomeqOrlKia9CrQ1C0cIKEx1-qJir6I";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error listing models:", error);
  }
}

listModels();
