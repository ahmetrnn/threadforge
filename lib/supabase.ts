import { cookies } from "next/headers";
import {
  createServerActionClient,
  createServerComponentClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

export const createSupabaseRouteHandlerClient = () => {
  return createRouteHandlerClient({ cookies });
};

export const createSupabaseServerClient = () => {
  return createServerComponentClient({ cookies });
};

export const createSupabaseServerActionClient = () => {
  return createServerActionClient({ cookies });
};

export type SupabaseServerClient = ReturnType<typeof createSupabaseServerClient>;
export type SupabaseRouteClient = ReturnType<typeof createSupabaseRouteHandlerClient>;
export type GenericSupabaseClient = SupabaseClient;
