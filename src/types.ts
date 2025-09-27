export type EventDate = {
	start_date: string;
	when: string;
};

export type TicketInfo = {
	source: string;
	link: string;
	link_type: string;
};

export type Venue = {
	name: string;
	rating: number;
	reviews: number;
	link: string;
};

export type Event = {
	title: string;
	address: string[];
	date: EventDate;
	link: string;
	ticket_info: TicketInfo[];
	venue: Venue;
	thumbnail: string;
};

export interface CharbotResponse {
	events: Event[];
};

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
export const gemini_api = process.env.GEMINI_API_KEY!;
export const serpapi = process.env.SERPAPI_KEY!;
