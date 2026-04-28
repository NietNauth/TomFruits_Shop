import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyC1EomeqOrlKia9CrQ1C0cIKEx1-qJir6I";
const genAI = new GoogleGenerativeAI(API_KEY);

async function checkModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    const flashModels = data.models.filter(m => m.name.includes("flash"));
    console.log("Flash models available:");
    flashModels.forEach(m => console.log(m.name));
    
    const proModels = data.models.filter(m => m.name.includes("pro"));
    console.log("\nPro models available:");
    proModels.forEach(m => console.log(m.name));
  } catch (error) {
    console.error("Error:", error);
  }
}

checkModels();
