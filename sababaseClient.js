// js/supabaseClient.js
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL = "https://dtriltzrvdhnlxqbiced.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cmlsdHpydmRobmx4cWJpY2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDM1NzMsImV4cCI6MjA3Njk3OTU3M30.S4gwVrXBiM3wbmp_LOfaFhpbTlnnaw7fZNSgpbzDI28";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
