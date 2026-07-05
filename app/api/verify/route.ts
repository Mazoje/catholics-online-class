import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");
  const transaction_id = searchParams.get("transaction_id");

  console.log("======== FLUTTERWAVE CALLBACK DETECTED ========");
  console.log("URL Status parameter:", status);
  console.log("Transaction ID reference:", transaction_id);
  console.log("Database Tx Ref look-up key:", tx_ref);

  const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (status === "successful" && transaction_id) {
    try {
      console.log("Verifying token with Flutterwave servers...");
      const flwResponse = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      });
      
      const flwData = await flwResponse.json();
      console.log("Flutterwave Verification Server Response:", flwData);

      if (flwData.status === "success" && flwData.data.status === "successful") {
        console.log("Payment confirmed authentic. Extracting student data...");
        
        const txData = flwData.data;
        const meta = txData.meta || {};

        // FIX: Mapped keys directly to snake_case to match your database columns
        const studentRecord = {
          tx_ref: tx_ref || txData.tx_ref,
          full_name: txData.customer.name,       // 👈 Changed from fullName
          email: txData.customer.email,
          country: meta.country || "Unknown",
          parish_diocese: meta.parishDiocese || "Not Specified", // 👈 Changed from parishDiocese
          primary_role: meta.primaryRole || "Other",     // 👈 Changed from primaryRole
          payment_status: "completed",
          amount: txData.amount,
          currency: txData.currency,
        };

        console.log("Saving complete student profile to Supabase via upsert...");
        
        const { error: dbError } = await supabase
          .from("registrations")
          .upsert(studentRecord, { onConflict: "tx_ref" });

        if (dbError) {
          console.error("🔴 Supabase Database Save Failure:", dbError.message);
        } else {
          console.log("✅ Supabase successfully saved completed student registration!");
        }

        return NextResponse.redirect(`${baseUrl}/success?verified=true`);
      } else {
        console.log("Verification rejected: Flutterwave returned unsuccessful data status.");
      }
    } catch (err) {
      console.error("The verification request network process crashed:", err);
    }
  } else {
    console.log("Verification bypassed: URL status parameter was not 'successful' or ID was missing.");
  }

  // This will now catch your manual cancellations perfectly and redirect to your success page with verified=false
  return NextResponse.redirect(`${baseUrl}/success?verified=false`);
}