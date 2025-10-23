import { NextResponse } from "next/server";

import { getStripe } from "@/lib/stripe";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseRouteHandlerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const stripe = getStripe();
    const origin = request.headers.get("origin") ?? new URL(request.url).origin;

    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ThreadForge Pro",
              description: "Unlimited AI threads for indie makers",
            },
            recurring: { interval: "month" },
            unit_amount: 900,
          },
          quantity: 1,
        },
      ],
      subscription_data: {
        metadata: {
          userId: user.id,
        },
      },
      success_url: `${origin}/dashboard?upgrade=success`,
      cancel_url: `${origin}/dashboard?upgrade=cancelled`,
      customer_email: user.email ?? undefined,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
      },
    });

    if (!checkout.url) {
      return NextResponse.json({ message: "Unable to create checkout session." }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl: checkout.url });
  } catch (error) {
    console.error("stripe checkout error", error);
    return NextResponse.json({ message: "Stripe error" }, { status: 500 });
  }
}
