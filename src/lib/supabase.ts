
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccppkihphmmhvhqrymfn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjcHBraWhwaG1taHZocXJ5bWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDk0ODQsImV4cCI6MjA1NzI4NTQ4NH0.HeOyZKXOivHj3uFJZb2fayPJU7TjPT57oHFx-dDFnHY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
