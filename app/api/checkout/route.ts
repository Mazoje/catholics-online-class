import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, country, parishDiocese, primaryRole, amount } = body;

    // ⬇️ PLACE THE UPDATED CONFIG BLOCK HERE ⬇️
    const config = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY, 
      tx_ref: `tx-${Date.now()}`,
      amount: Number(amount),
      currency: 'USD',
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
        description: 'Course Registration Payment',
      },
    };

    // Send this config payload to Flutterwave
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