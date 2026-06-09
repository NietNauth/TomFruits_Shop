import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const aiService = {
  /**
   * Phân tích query của người dùng và trả về JSON hướng dẫn
   */
  generateSuggestion: async (query) => {
    if (!API_KEY) {
      throw new Error('Vui lòng cấu hình VITE_GEMINI_API_KEY trong file .env');
    }
    const recipeMap = {
      salad: ['xà lách', 'cà chua', 'dưa leo'],
      'sinh tố': ['chuối', 'bơ', 'dâu'],
      'nước ép': ['cam', 'táo', 'cà rốt'],
      'canh chua': [
        'cá hồi',
        'cà chua',
        'me chua',
        'bạc hà',
        'đậu bắp',
        'nước mắm',
        'ớt',
      ],
      'bún bò': ['thịt bò', 'bún', 'sả', 'hành tím', 'ớt'],
      'phở gà': ['thịt gà', 'bánh phở', 'hành lá', 'gừng'],
      'phở bò': ['thịt bò', 'bánh phở', 'hành lá', 'gừng'],
      'cá kho': ['cá', 'nước mắm', 'ớt', 'hành tím'],
      'thịt kho': ['thịt lợn', 'trứng', 'nước dừa', 'nước mắm'],
      'rau xào': ['rau cải', 'tỏi', 'dầu ăn'],
      'cơm chiên': ['trứng gà', 'hành lá', 'dầu ăn'],
      'gà chiên': ['thịt gà', 'tỏi', 'dầu ăn'],
      'bò xào': ['thịt bò', 'hành tây', 'ớt chuông', 'tỏi'],
      'cháo gà': ['thịt gà', 'gạo', 'gừng', 'hành lá'],
      'lẩu thái': ['tôm', 'mực', 'nấm', 'sả', 'cà chua'],
      'lẩu bò': ['thịt bò', 'nấm', 'rau cải', 'hành tây'],
      'gỏi cuốn': ['tôm', 'thịt lợn', 'rau sống', 'bánh tráng'],
      'bánh xèo': ['tôm', 'thịt lợn', 'giá đỗ', 'hành lá'],
    };
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
      Bạn là một trợ lý mua sắm thông minh tên là "Tom Bot" cho cửa hàng "Tom Fruits Shop".
      Cửa hàng bán: Trải cây nhập khẩu, rau sạch, thịt tươi, hải sản, và đồ khô, gia vị.
      
      Người dùng hỏi: "${query}"
      
      Nhiệm vụ:
      1. Trả lời ngắn gọn, thân thiện (ai_response).
      2. Nếu họ hỏi về món ăn, hãy đưa ra công thức cực ngắn gọn (recipe).
      3. Trích xuất tối đa 5 DANH TỪ riêng biệt là tên các loại thực phẩm cần thiết để nấu món đó hoặc liên quan đến câu hỏi (search_keywords). Ví dụ: ["cá hồi", "cà chua", "ớt"].
      
      CHỈ trả về JSON nguyên bản, không dùng ký hiệu markdown \`\`\`json.
      Cấu trúc:
      {"ai_response": "...", "recipe": "...", "search_keywords": ["keyword1", "keyword2"]}
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean JSON in case Gemini adds markdown
      const cleanedJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Gemini Error:', error);
      throw error;
      // const keyword = query.toLowerCase().trim();

      // return {
      //   ai_response:
      //     'Hiện tại trợ lý AI đang quá tải, tôi sẽ gợi ý sản phẩm phù hợp cho bạn.',
      //   recipe: '',
      //   search_keywords: recipeMap[keyword] || [query],
      // };
    }
  },
};

export default aiService;
