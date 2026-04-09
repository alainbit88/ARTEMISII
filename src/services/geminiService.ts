import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface ArtemisData {
  distanceFromEarth: number; // km
  distanceFromMoon: number; // km
  velocity: number; // km/h
  status: string;
  timestamp: string;
  coordinates: {
    x: number;
    y: number;
    z: number;
  };
  trajectory: { x: number; y: number; z: number }[];
}

export async function fetchArtemisData(): Promise<ArtemisData> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Search for the current real-time status and telemetry of the Artemis II mission from NASA's official sources (like NASA's Artemis website or official mission trackers). Provide the current distance from Earth (km), distance from the Moon (km), current velocity (km/h), and mission status. Also, provide a simplified 3D trajectory (10 points) representing the path from Earth to the current position. Ensure the data reflects the current date and time: " + new Date().toISOString(),
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          distanceFromEarth: { type: Type.NUMBER },
          distanceFromMoon: { type: Type.NUMBER },
          velocity: { type: Type.NUMBER },
          status: { type: Type.STRING },
          timestamp: { type: Type.STRING },
          coordinates: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER },
              y: { type: Type.NUMBER },
              z: { type: Type.NUMBER },
            },
            required: ["x", "y", "z"],
          },
          trajectory: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                z: { type: Type.NUMBER },
              },
              required: ["x", "y", "z"],
            },
          },
        },
        required: ["distanceFromEarth", "distanceFromMoon", "velocity", "status", "timestamp", "coordinates", "trajectory"],
      },
      tools: [{ googleSearch: {} }],
    },
  });

  if (!response.text) {
    throw new Error("Failed to fetch Artemis data");
  }

  return JSON.parse(response.text);
}
