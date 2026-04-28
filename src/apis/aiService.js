import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const aiService = {
  /**
   * Phân tích query của người dùng và trả về JSON hướng dẫn
   */
  generateSuggestion: async (query) => {
    if (!API_KEY) {
       throw new Error("Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Bạn là một trợ lý mua sắm thông minh tên là "Tom Bot" cho cửa hàng "Tom Fruits Shop".
      Cửa hàng bán: Trải cây nhập khẩu, rau sạch, thịt tươi, hải sản, và đồ khô.
      
      Người dùng hỏi: "${query}"
      
      Nhiệm vụ:
      1. Trả lời ngắn gọn, thân thiện (ai_response).
      2. Nếu họ hỏi về món ăn, hãy đưa ra công thức cực ngắn gọn (recipe).
      3. Trích xuất tối đa 5 DANH TỪ riêng biệt là tên các loại thực phẩm cần thiết để nấu món đó hoặc liên quan đến câu hỏi (search_keywords). Ví dụ: ["cho cá hồi", "cà chua", "ớt"].
      
      CHỈ trả về JSON nguyên bản, không dùng ký hiệu markdown \`\`\`json.
      Cấu trúc:
      {"ai_response": "...", "recipe": "...", "search_keywords": ["keyword1", "keyword2"]}
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean JSON in case Gemini adds markdown
      const cleanedJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }
};

export default aiService;
