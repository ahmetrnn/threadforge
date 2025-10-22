import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getStripe } from "@/lib/stripe";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const signature = headers().get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ message: "Missing Stripe signature." }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ message: "Invalid signature." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId ?? session.client_reference_id ?? null;
    if (userId) {
      const { error } = await supabase
        .from("users")
        .update({ subscription_status: "pro" })
        .eq("auth_user_id", userId);
      if (error) {
        console.error("Failed to mark user as pro", error);
      }
    }
  }

  if (event.type === "customer.subscription.deleted" || event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;
    const userId = (subscription.metadata?.userId as string | undefined) ?? null;
    if (userId) {
      const status = subscription.status === "active" || subscription.status === "trialing" ? "pro" : "free";
      const { error } = await supabase
        .from("users")
        .update({ subscription_status: status })
        .eq("auth_user_id", userId);
      if (error) {
        console.error("Failed to sync subscription status", error);
      }
    }
  }

  return NextResponse.json({ received: true });
}
