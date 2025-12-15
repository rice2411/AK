import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Deprecated based on new data flow, but keeping signature safe or unused
export const getTaskSuggestions = async (goal: string): Promise<string[]> => {
    return [];
};

export const getProgressAnalysis = async (tasks: Task[]): Promise<string> => {
  try {
    // Summarize task data for the LLM
    const taskSummary = tasks.map(t => 
      `Subject: "${t.subject}", Status: ${t.status_extra_info.name}, Assigned To: ${t.assigned_to_extra_info?.full_name_display || 'Unassigned'}`
    ).join("\n");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are a Project Manager Assistant. Analyze the following list of tasks:\n\n${taskSummary}\n\nProvide a 2-sentence summary of the project health. Mention if there are bottlenecks (too many items in one status) or unassigned tasks. Be professional but encouraging.`,
    });

    return response.text || "Your project is looking active.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Unable to analyze project data at the moment.";
  }
};
