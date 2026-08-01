// src/services/aiService.js
import axios from 'axios';

// OpenRouter API configuration
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Default model - using a free model that works well
const DEFAULT_MODEL = 'google/gemini-2.0-flash-exp:free';
// Alternative models (change as needed):
// - 'google/gemini-2.0-flash-exp:free' (Google's Gemini Flash - free)
// - 'meta-llama/llama-3.2-3b-instruct:free' (Meta Llama - free)
// - 'microsoft/phi-3.5-mini-128k-instruct:free' (Microsoft Phi - free)
// - 'qwen/qwen-2.5-72b-instruct:free' (Qwen - free)
// - 'deepseek/deepseek-chat:free' (DeepSeek - free)

// UK Academy context for the AI
const SYSTEM_PROMPT = `You are UK Academy's AI Assistant, a helpful and knowledgeable guide for students, parents, and educators.

About UK Academy:
- UK Academy is a premier NEET & JEE training center in Hosur, Tamil Nadu
- We offer comprehensive coaching for NEET, JEE Main & Advanced, Foundation (NTSE/Olympiad), and NEET & JEE Foundation (Individual) for Class 6th to 12th
- We also provide Faculty Certification Programs including Nursery Teacher Training, Primary Teacher Training, PG Diploma in Montessori, STEAM Trainer, Abacus Teacher Training, and more
- Contact: +91 9944316004, Email: ukacademy55.com
- Location: 696/5, NSP Towers, Hosur-Bagalur Main Road, Ngo Colony, Hosur - 635109

Your role:
1. Be friendly, professional, and encouraging
2. Provide accurate information about UK Academy's courses, programs, and services
3. Help students choose the right course based on their goals
4. Guide parents through the enrollment process
5. Explain scholarship opportunities
6. Share details about faculty training programs
7. Answer questions about exams (NEET, JEE, NTSE, Olympiad)
8. If asked something outside UK Academy scope, politely redirect to relevant academy information

Course Information:
- NEET: For Class 11-12 + Droppers, 2-year program, ₹1,20,000
- JEE (Main + Advanced): For Class 11-12 + Droppers, 1-2 years, ₹1,50,000
- Foundation (NTSE/Olympiad): For Class 6-10, 1-2 years, ₹60,000
- NEET & JEE Foundation (Individual): For Class 6-12, direct individual admission, Classroom & Online options, fees vary by class
- Faculty Programs: 3 months, ₹30,000 each

Be concise but informative. Keep responses under 150 words unless more detail is requested.`;

// System prompt for quick actions
const QUICK_ACTION_PROMPTS = {
  neet: "Provide a brief overview of UK Academy's NEET program including duration, fees, and key features.",
  jee: "Provide a brief overview of UK Academy's JEE program including duration, fees, and key features.",
  scholarship: "Explain the UK Academy Scholarship Test, how to register, and the scholarship tiers (up to 100% waiver).",
  counselling: "Explain the free counselling process at UK Academy and what students can expect.",
  campus: "Provide campus details, address, and facilities at UK Academy.",
};

/**
 * Send a message to OpenRouter AI
 */
export async function sendMessageToAI(userMessage, conversationHistory = []) {
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured. Using fallback response.');
    return getFallbackResponse(userMessage);
  }

  try {
    // Prepare messages for the API
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: DEFAULT_MODEL,
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.9,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'UK Academy AI Assistant',
        },
        timeout: 15000, // 15 second timeout
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return {
        success: true,
        message: response.data.choices[0].message.content,
        usage: response.data.usage,
      };
    } else {
      throw new Error('Invalid response from OpenRouter');
    }
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    
    // Check if it's a rate limit or other specific error
    if (error.response?.status === 429) {
      return {
        success: false,
        message: "I'm receiving too many requests right now. Please try again in a moment.",
        error: 'rate_limit'
      };
    } else if (error.response?.status === 401) {
      return {
        success: false,
        message: "There's an issue with the API key. Please contact support.",
        error: 'auth_error'
      };
    } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        success: false,
        message: "The request is taking too long. Please try again.",
        error: 'timeout'
      };
    }
    
    return {
      success: false,
      message: getFallbackResponse(userMessage),
      error: 'general_error'
    };
  }
}

/**
 * Get a quick response for common queries without API call
 */
export function getQuickResponse(actionId, userMessage = '') {
  const quickResponses = {
    neet: "UK Academy's NEET program is a comprehensive 2-year course for Class 11-12 students and droppers. It includes expert faculty, NCERT-focused learning, regular mock tests, and personalized mentorship. The fee is ₹1,20,000. Want to know more or book a free counselling session?",
    jee: "UK Academy's JEE program offers comprehensive preparation for JEE Main & Advanced. It's a 1-2 year program with expert faculty, daily practice tests, doubt sessions, and complete study material. Fee: ₹1,50,000. Would you like to know more?",
    scholarship: "UK Academy offers merit and need-based scholarships up to 100% tuition waiver. The scholarship test is open to all Class 6-12 students. Scholarship tiers: 95%+ = 100% waiver, 90-94.9% = 75% waiver, 80-89.9% = 50% waiver, 70-79.9% = 25% waiver. Ready to register?",
    counselling: "UK Academy offers free one-on-one counselling sessions with academic experts. You can choose online or offline mode. Our team will understand your goals, assess your current level, and suggest the best course path. Book your free session now!",
    campus: "UK Academy is located at 696/5, NSP Towers, Hosur-Bagalur Main Road, Ngo Colony, Hosur - 635109. We have modern classrooms, well-equipped labs, a library, and a comfortable learning environment. Office hours: Mon-Sat 8:00 AM - 7:00 PM.",
  };

  // If user message contains specific keywords, use that
  const lowerMsg = userMessage.toLowerCase();
  if (lowerMsg.includes('neet')) return quickResponses.neet;
  if (lowerMsg.includes('jee')) return quickResponses.jee;
  if (lowerMsg.includes('scholarship') || lowerMsg.includes('test')) return quickResponses.scholarship;
  if (lowerMsg.includes('counsel') || lowerMsg.includes('book')) return quickResponses.counselling;
  if (lowerMsg.includes('campus') || lowerMsg.includes('address') || lowerMsg.includes('location')) return quickResponses.campus;
  
  return quickResponses[actionId] || null;
}

/**
 * Fallback response when AI is unavailable
 */
function getFallbackResponse(userMessage) {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('neet')) {
    return "UK Academy's NEET program offers comprehensive preparation with expert faculty, NCERT-focused learning, and regular mock tests. It's a 2-year program for Class 11-12 students and droppers. Fee: ₹1,20,000. Would you like to book a free counselling session to learn more?";
  } else if (lowerMsg.includes('jee')) {
    return "UK Academy's JEE program provides complete preparation for JEE Main & Advanced with concept building, daily practice, and doubt sessions. Duration: 1-2 years, Fee: ₹1,50,000. Interested in joining?";
  } else if (lowerMsg.includes('scholarship') || lowerMsg.includes('test')) {
    return "UK Academy offers scholarship tests with up to 100% tuition waiver. Tiers: 95%+ = 100%, 90-94.9% = 75%, 80-89.9% = 50%, 70-79.9% = 25%. Register now for the next test!";
  } else if (lowerMsg.includes('counsel') || lowerMsg.includes('book') || lowerMsg.includes('help')) {
    return "Great! I can help you book a free counselling session. Our experts will guide you through course selection, career paths, and scholarship opportunities. Shall I open the booking form for you?";
  } else if (lowerMsg.includes('campus') || lowerMsg.includes('address') || lowerMsg.includes('location')) {
    return "UK Academy is at 696/5, NSP Towers, Hosur-Bagalur Main Road, Ngo Colony, Hosur - 635109. We're open Mon-Sat 8:00 AM - 7:00 PM. You can call us at +91 9944316004 for directions.";
  } else if (lowerMsg.includes('faculty') || lowerMsg.includes('teacher') || lowerMsg.includes('training')) {
    return "UK Academy offers various Faculty Certification Programs including Nursery Teacher Training, Primary Teacher Training, PG Diploma in Montessori, STEAM Trainer, and Abacus Teacher Training. All programs are 3 months with a fee of ₹30,000. Which program interests you?";
  } else {
    return "Thank you for reaching out! I'm here to help you with information about UK Academy's courses, admissions, scholarships, and faculty programs. Could you tell me what you're specifically looking for? I can help with NEET, JEE, Foundation courses, or our teacher training programs.";
  }
}

/**
 * Check if the message is a quick action
 */
export function isQuickAction(message, actions) {
  const lowerMsg = message.toLowerCase();
  return actions.some(action => lowerMsg.includes(action.id));
}