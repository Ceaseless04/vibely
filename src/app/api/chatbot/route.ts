import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/libs/supabaseClient";
import { GoogleGenAI } from "@google/genai";
import { gemini_api } from "@/types";
import {fetchTopEvents} from "@/libs/serpapi";

const chatbot = new GoogleGenAI({ apiKey: gemini_api });

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
		if (!token) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: 401 }
			);
		}

    const { 
			data: { user }, 
			error 
		} = await supabase.auth.getUser(token);
		if (error || !user) {
			return NextResponse.json(
				{ error: "Unauthorized" }, 
				{ status: 401 }
			);
		}

    const body = await req.json();
    const message = body.message as string;
		if (!message) {
			return NextResponse.json(
				{ error: "Message is required" }, 
				{ status: 400 }
			);
		}

    const eventKeyWords = [
			"event",
			"concert",
			"party",
			"festival",
			"conference",
			"meetup",
			"show"
		];
		const locationPattern = /in\s+([a-zA-Z\s]+)/i;

		const isEventRelated = eventKeyWords.some(
			k => message.toLowerCase().includes(k)
		);
		const locationMatch = message.match(locationPattern);

    if (!isEventRelated) {
      return NextResponse.json({
        sender: "bot",
        text: "Sorry, I cannot talk about this right now. Please start a new chat."
      });
    }

		if (locationMatch) {
			const location = locationMatch[1];
			// calling serpapi to get top events based on location
			const events = await fetchTopEvents(location);

			return NextResponse.json({
				sender: "bot",
				events
			});
		}

    const response = await chatbot.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an events assistant. Respond only to questions about events. User asked: "${message}"`
    });

    return NextResponse.json({
			sender: 'bot', 
			text: response.text 
		});
  } catch (e: any) {
    return NextResponse.json(
			{ error: e.message || "Internal Server Error" },
			{ status: 500 }
		);
  }
}
