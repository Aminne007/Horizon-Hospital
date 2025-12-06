import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable signup/login."
  );
}

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
          // Fallback stub to prevent runtime crash when env vars are missing
          signUp: async () => ({
            data: null,
            error: new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."),
          }),
          signInWithPassword: async () => ({
            data: null,
            error: new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."),
          }),
          signOut: async () => ({
            error: new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."),
          }),
          getUser: async () => ({
            data: { user: null },
            error: new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."),
          }),
        },
        from: () => {
          const stubQuery = () => ({
            select: () => stubQuery(),
            eq: () => stubQuery(),
            in: () => stubQuery(),
            order: () => stubQuery(),
            single: async () => ({
              data: null,
              error: new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."),
            }),
            maybeSingle: async () => ({
              data: null,
              error: new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."),
            }),
            insert: async () => ({
              data: null,
              error: new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."),
            }),
            upsert: async () => ({
              data: null,
              error: new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."),
            }),
          });
          return stubQuery();
        },
        storage: {
          from: () => ({
            upload: async () => ({
              error: new Error("Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."),
            }),
            getPublicUrl: () => ({ data: { publicUrl: "" } }),
          }),
        },
      };
