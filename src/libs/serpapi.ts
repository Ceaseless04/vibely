import { serpapi } from "@/types";

export async function fetchTopEvents(location: string) {
  const res = await fetch(
    `https://serpapi.com/search.json?q=top+events+in+${encodeURIComponent(location)}&api_key=${serpapi}`
  );
		if (!res.ok) {
			throw new Error("Failed to fetch events");
		}
  const data = await res.json();
  // Transform the data Event type
  return data.events || [];
}
