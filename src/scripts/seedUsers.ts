
import {supabaseServiceRoleKey, supabaseUrl} from "@/types";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

async function seedUsers() {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: "testuser@example.com",
    password: "password123",
    email_confirm: true, // bypass confirmation
  });

  if (error) console.error("Error creating user:", error);
  else console.log("Created user:", data.user);
}

seedUsers();
