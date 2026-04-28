import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC1EomeqOrlKia9CrQ1C0cIKEx1-qJir6I";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testWorkingModel() {
  const modelsToTry = [
    "gemini-flash-latest",
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-pro-latest"
  ];

  for (const modelName of modelsToTry) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      console.log(`✅ Success with ${modelName}: ${response.text().substring(0, 30)}...`);
      return; // Stop if success
    } catch (error) {
      console.error(`❌ Failed with ${modelName}: ${error.message}`);
    }
  }
}

testWorkingModel();
