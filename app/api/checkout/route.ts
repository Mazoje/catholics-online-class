import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, country, parishDiocese, primaryRole } = body;

    // Validate that all required fields are present
    if (!fullName || !email || !country || !parishDiocese || !primaryRole) {
      return new NextResponse("Missing required registration fields", { status: 400 });
    }

    // Create a unique transaction reference identifier
    const txRef = `coc-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    // Prepare the payload for Flutterwave's V3 Standard Payment API
    const flutterwavePayload = {
      tx_ref: txRef,
      amount: "20.00",
      currency: "USD",
      redirect_url: `${baseUrl}/payment-status`, // <-- updated
      customer: {
        email: email,
        name: fullName,
      },
      meta: {
        country,
        parishDiocese,
        primaryRole,
      },
      customizations: {
        title: "Catholic Online Class",
        description: "Catechist Formation Program Registration Fee",
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo-dark.png`,
      },
    };

    // Send the secure request to Flutterwave using your hidden Secret Key
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(flutterwavePayload),
    });

    const data = await response.json();

    if (data.status === "success" && data.data?.link) {
      // Return the secure checkout URL back to your frontend form
      return NextResponse.json({ url: data.data.link });
    } else {
      console.error("Flutterwave API Error:", data);
      return new NextResponse(data.message || "Payment initialization failed", { status: 500 });
    }
  } catch (error) {
    console.error("Internal Checkout Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}