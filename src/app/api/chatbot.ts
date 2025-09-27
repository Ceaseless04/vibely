import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/libs/supabaseClient";
import { GoogleGenAI } from "@google/genai";
import {gemini_api} from "@/types";

const chatbot: GoogleGenAI = new GoogleGenAI({ apiKey: gemini_api }); 

export default async function handler(
	req: NextApiRequest, 
	res: NextApiResponse
) {
	const token: string | undefined = req.headers.authorization?.split(" ")[1];	
	const { 
		data: { 
			user 
		}, 
		error 
	} = await supabase.auth.getUser(token);
	const { message } = req.body;
	const eventKeyWords: string[] = [
		"event",
		"concert",
		"party",
		"festival",
		"conference",
		"meetup",
		"show"
	];

	const isEventRelated: boolean = eventKeyWords.some(k => message.toLowerCase().includes(k));

	if (!token) {
		return res
			.status(401)
			.json({
				error: "Unauthorized"
			});
	}

	if (error || !user) {
		return res
			.status(401).json({ error: "Unauthorized" });
	}

	if (!message) {
		return res
			.status(400).json({ error: "Message is required" });
	}

	if (!isEventRelated) {
		return res
		.status(200).json({
			sender: "bot",
			text: "Sorry, I cannot talk about this right now. Please start a new chat."
		});
	}

	try {
		const respone = await chatbot.models.generateContent({
			model: 'gemini-2.5-flash',
			contents: "You are an events assistant. Respond only to questions"
		});

		return res
			.status(200)
			.json({ sender: 'bot', text: respone.text });
	} catch(e: any) {
		return res
			.status(500)
			.json({ error: "Internal Server Error" });
	}
}
