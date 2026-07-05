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
    const { fullName, email, country, parishDiocese, primaryRole, amount, currency } = body;

    const tx_ref = `tx-${Date.now()}`;

    // FIX 1: Point accurately to NEXT_PUBLIC_SITE_URL so cancel/success maps away from localhost
  const siteUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : "http://localhost:3000";
  
    const config = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY, 
      tx_ref: tx_ref,
      amount: Number(amount),
      currency: currency || 'NGN', 
      redirect_url: `${siteUrl}/api/verify`, // 👈 Fixed variable path assignment
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

    // FIX 2: Wrapped in isolated try/catch to expose column-mapping failures
    try {
      const { error: dbError } = await supabase
        .from("registrations")
        .insert([
          {
            tx_ref: tx_ref,
            full_name: fullName,       // ⚠️ double check: verify your database column name isn't "fullname" or "fullName"
            email: email,
            country: country || "Unknown",
            parish_diocese: parishDiocese, // ⚠️ double check: verify column schema definitions
            primary_role: primaryRole,     // ⚠️ double check: verify column schema definitions
            payment_status: "pending", 
            amount: Number(amount),
            currency: currency || 'NGN',
          }
        ]);

      if (dbError) {
        console.error("🔴 Supabase Specific Database Rejection Error:", dbError.message);
        console.error("Error Code Context:", dbError.code);
      } else {
        console.log(`✅ Database logged transaction reference ${tx_ref} successfully as PENDING.`);
      }
    } catch (dbCrash) {
      console.error("💥 Supabase execution thread crashed entirely:", dbCrash);
    }

    // 2. Send dynamic config payload to Flutterwave
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