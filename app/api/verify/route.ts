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

  // TERMINAL LOGS: See if Flutterwave is even reaching your machine
  console.log("======== FLUTTERWAVE CALLBACK DETECTED ========");
  console.log("URL Status parameter:", status);
  console.log("Transaction ID reference:", transaction_id);
  console.log("Database Tx Ref look-up key:", tx_ref);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

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
        console.log("Payment confirmed authentic. Updating Supabase row...");
        
        const { error: dbError } = await supabase
          .from("registrations")
          .update({ payment_status: "completed" })
          .eq("tx_ref", tx_ref);

        if (dbError) {
          console.error("Supabase Database Update Failure:", dbError.message);
        } else {
          console.log("Supabase successfully updated status to: completed!");
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

  return NextResponse.redirect(`${baseUrl}/success?verified=false`);
}