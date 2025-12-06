import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, RecommendationResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// System instruction for consistent persona
const SYSTEM_INSTRUCTION = "You are a warm, encouraging, and knowledgeable career counselor for Cambodian students. You specialize in the Cambodian job market and education system.";

export const getCareerRecommendations = async (profile: UserProfile): Promise<RecommendationResponse> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze the following student profile and suggest the 3 most suitable careers specifically for the Cambodian context.
    
    Student Profile:
    - Favorite Subjects: ${profile.subjects.join(", ")}
    - Hobbies/Interests: ${profile.hobbies.join(", ")}
    - Soft Skills: ${profile.skills.join(", ")}
    - Additional Notes: ${profile.additionalInfo}

    Provide the response in the Khmer language (Cambodian).
    
    IMPORTANT:
    1. 'averageSalary': Provide a realistic monthly salary range for entry-level to mid-level in Cambodia (e.g., "$250 - $500").
    2. 'topUniversities': List 2-3 specific real universities in Cambodia known for this major (e.g., RUPP, ITC, NUM, Parangrach).
    3. 'roadmap': Provide 3 steps: "High School Focus", "University Major", "Internship/First Job".
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Job title in Khmer" },
                  description: { type: Type.STRING, description: "Brief description" },
                  matchReason: { type: Type.STRING, description: "Why this fits" },
                  requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  educationPath: { type: Type.STRING, description: "Major to study" },
                  averageSalary: { type: Type.STRING, description: "Monthly salary range in USD" },
                  topUniversities: { type: Type.ARRAY, items: { type: Type.STRING } },
                  roadmap: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        stage: { type: Type.STRING, description: "e.g., University" },
                        action: { type: Type.STRING, description: "What to do" }
                      }
                    }
                  }
                },
                required: ["title", "description", "matchReason", "requiredSkills", "educationPath", "averageSalary", "topUniversities", "roadmap"]
              }
            },
            advice: {
              type: Type.STRING,
              description: "Encouraging advice in Khmer."
            }
          },
          required: ["recommendations", "advice"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as RecommendationResponse;
    } else {
      throw new Error("No response text received");
    }
  } catch (error) {
    console.error("Error fetching career advice:", error);
    throw error;
  }
};

export const generateAudioAdvice = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: {
        parts: [{ text: text }],
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received");
    return base64Audio;
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
};

export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION + " Keep answers concise (under 100 words) and in Khmer.",
    },
  });
};