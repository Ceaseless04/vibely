import { serpapi } from "@/types";

export async function fetchTopEvents(location: string) {
  const res = await fetch(
    `https://serpapi.com/search.json?q=top+events+in+${encodeURIComponent(location)}&api_key=${serpapi}`
  );
  
  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  const data = await res.json();
  console.log("[SerpAPI] Full response:", data);

  // Extract events from events_results
  if (Array.isArray(data.events_results)) {

    // Format event info for display
    return data.events_results.map((ev: any) => {

      let info = `${ev.title}`;
      if (ev.date) {
        info += ` (${ev.date})`
      };

      return info;
    });
  }
  return [];
}
