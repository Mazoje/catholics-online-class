import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Extract everything sent from the frontend form
    const body = await request.json();
    const { fullName, email, country, parishDiocese, primaryRole, amount } = body;

    // 2. PLACE YOUR CONFIG OBJECT HERE
    const config = {
      // Use your Flutterwave Secret Key on the backend for security
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY, 
      tx_ref: `tx-${Date.now()}`,
      amount: Number(amount), // 👈 Captures the custom amount dynamically
      currency: 'USD',
      payment_options: 'card,mobilemoney,ussd',
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/verify`, // Redirects back after payment
      customer: {
        email: email,     // 👈 Dynamic email from form
        name: fullName,   // 👈 Dynamic name from form
      },
      meta: {
        country: country,
        parishDiocese: parishDiocese,
        primaryRole: primaryRole,
      },
      customizations: {
        title: 'Catholic Online Class',
        description: 'Course Registration Payment',
      },
    };

    // 3. Send this config payload to Flutterwave
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`, // Your secret key
        "Content-Type": "application/json",
      },
      body: JSON.stringify(config),
    });

    const data = await response.json();

    if (data.status === "success") {
      // Send the payment URL back to the frontend to redirect the user
      return NextResponse.json({ url: data.data.link });
    } else {
      return new NextResponse(data.message || "Flutterwave initialization failed", { status: 400 });
    }

  } catch (error: any) {
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}