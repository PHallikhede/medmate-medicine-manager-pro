// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://owvbwarvsjitlferjjvz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93dmJ3YXJ2c2ppdGxmZXJqanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NDU2OTIsImV4cCI6MjA2NTMyMTY5Mn0.CV-P7tuXmUWm5UIFdY4M-DEWfk4gk974BcLmFKFSVYI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);