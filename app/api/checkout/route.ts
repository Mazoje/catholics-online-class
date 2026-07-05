import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase Client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Extract currency from the incoming request body
    const { fullName, email, country, parishDiocese, primaryRole, amount, currency } = body;

    const tx_ref = `tx-${Date.now()}`;

    const config = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY, 
      tx_ref: tx_ref,
      amount: Number(amount),
      // Fallback to NGN if something goes wrong, otherwise use the selected currency
      currency: currency || 'NGN', 
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/verify`,
      customer: {
        email: email,
        name: fullName,
      },
      meta: {
        country: country,
        parishDiocese: parishDiocese,
        primaryRole: primaryRole,
      },
      customizations: {
        title: 'Catholic Online Class',
        description: `Course Registration Payment (${currency || 'NGN'})`,
      },
    };

    // 1. Create the row in Supabase as 'pending' BEFORE calling Flutterwave
    const { error: dbError } = await supabase
      .from("registrations")
      .insert([
        {
          tx_ref: tx_ref,
          fullName: fullName,
          email: email,
          country: country || "Unknown",
          parishDiocese: parishDiocese || "Not Specified",
          primaryRole: primaryRole || "Other",
          payment_status: "pending", // Tracks incomplete checkouts
          amount: Number(amount),
          currency: currency || 'NGN',
        }
      ]);

    if (dbError) {
      console.error("Supabase pre-checkout insert failure:", dbError.message);
    } else {
      console.log(`Successfully logged transaction ${tx_ref} as PENDING in database.`);
    }

    // 2. Send this dynamic config payload to Flutterwave
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    const data = await response.json();

    if (data.status === "success") {
      return NextResponse.json({ url: data.data.link });
    } else {
      return new NextResponse(data.message || "Flutterwave initialization failed", { status: 400 });
    }

  } catch (error: any) {
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}