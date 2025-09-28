import { fetchTopEvents } from "@/libs/serpapi";
import { supabase } from "@/libs/supabaseClient";
import { gemini_api } from "@/types";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

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
	const userCoords = body.userCoords as { lat: number; lng: number } | undefined;
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
	const messageLower = message.toLowerCase();
	const locationPattern = /in\s+([a-zA-Z\s]+)/i;
	const isEventRelated = eventKeyWords.some(
		k => messageLower.includes(k)
	);
	const locationMatch = message.match(locationPattern);
	// Detect if query is specific (mentions a type of event)
	const specificEventTypes = ["concert", "festival", "art", "sports", "music", "party"];
	const isSpecific = specificEventTypes.some(k => messageLower.includes(k));
	const location = locationMatch?.[1]?.trim();
	console.log("[Chatbot API] message:", message);
	console.log("[Chatbot API] isEventRelated:", isEventRelated);
	console.log("[Chatbot API] location:", location);
	console.log("[Chatbot API] isSpecific:", isSpecific);

	if (!isEventRelated) {
		console.log("[Chatbot API] Not event related.");
		return NextResponse.json({
			sender: "bot",
			text: "Sorry, I cannot talk about this right now. Please start a new chat."
		});
	}

	// General query with location, fetches top events
	if (!isSpecific && location) {
		console.log("[Chatbot API] Fetching top events for location:", location);
		const events = await fetchTopEvents(location);
		console.log("[Chatbot API] Events fetched:", events);
		// Format events as bullet points
		const formattedEvents = events.map((ev: string) => `* ${ev}`).join("\n");
		return NextResponse.json({
			sender: "bot",
			text: `Here are events in ${location}:\n\n${formattedEvents}`,
			events
		});
	}
	
	// If no location in prompt but userCoords present, use coordinates for event lookup
	if (!isSpecific && !location && userCoords) {
		if (
			typeof userCoords?.lat === 'number' &&
			typeof userCoords?.lng === 'number'
		) {
			console.log("[Chatbot API] Fetching top events for user coordinates:", userCoords);
			// You may want to reverse geocode here, but for now just use lat/lng as a string
			const events = await fetchTopEvents(`${userCoords!.lat},${userCoords!.lng}`);
			console.log("[Chatbot API] Events fetched:", events);
			const formattedEvents = events.map((ev: string) => `* ${ev}`).join("\n");
			return NextResponse.json({
				sender: "bot",
				text: `Here are events near you:\n\n${formattedEvents}`,
				events
			});
		}
	}

	const response = await chatbot.models.generateContent({
		model: 'gemini-2.5-flash',
		contents: `You are an events assistant. Respond only to questions about events. User asked: "${message}"`
	});
	console.log("[Chatbot API] Gemini response:", response);
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
