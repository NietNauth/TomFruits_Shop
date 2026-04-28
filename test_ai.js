import { GoogleGenerativeAI } from "@google/generative-ai";

// Paste the key directly for testing
const API_KEY = "AIzaSyC1EomeqOrlKia9CrQ1C0cIKEx1-qJir6I";
const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
  try {
    console.log("Testing Gemini API...");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent("Hello, are you there?");
    const response = await result.response;
    console.log("Success with gemini-1.5-flash-latest:", response.text());
  } catch (error) {
    console.error("Error with gemini-1.5-flash-latest:", error.message);
    try {
      console.log("Retrying with gemini-1.5-pro-latest...");
      const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-pro-latest" });
      const result2 = await model2.generateContent("Hello?");
      const response2 = await result2.response;
      console.log("Success with gemini-1.5-pro-latest:", response2.text());
    } catch (error2) {
      console.error("Error with gemini-1.5-pro-latest:", error2.message);
    }
  }
}

test();
