// app/success/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
function SuccessContent() {
  const searchParams = useSearchParams();
  // Read the status variable passed over by your verify/route.ts endpoint
  const isVerified = searchParams.get("verified") === "true";

  return (
    <div className="max-w-xl mx-auto text-center bg-white p-10 rounded-lg shadow-xl border border-gray-100">
      {isVerified ? (
        <>
          {/* Decorative cross marker using the brand gold color */}
          <div className="w-16 h-16 bg-[#998443]/10 text-[#998443] rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-light">
            †
          </div>
          
          <h1 className="text-3xl font-serif text-[#670001] font-bold mb-4 tracking-wide">
            Registration Confirmed
          </h1>
          
          <p className="text-[#000F32] mb-6 leading-relaxed">
            Thank you for enrolling in the <strong>Catechist Formation Program</strong>. Your registration payment has been securely processed.
          </p>
          
          <div className="bg-[#FDFBF7] p-5 rounded text-left text-sm space-y-3 border border-gray-200 mb-8 text-gray-700">
            <p className="font-semibold text-[#670001]">What happens next?</p>
            <p className="flex items-start gap-2">
              <span className="text-[#998443]">1.</span> You will receive an automated payment receipt directly to your email inbox.
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#998443]">2.</span> Our academic admissions team will review your parish background information.
            </p>
            <p className="flex items-start gap-2">
              <span className="text-[#998443]">3.</span> Within 24 to 48 hours, you will receive your official online portal login credentials and course syllabus.
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
            ✕
          </div>
          
          <h1 className="text-3xl font-serif text-red-800 font-bold mb-4 tracking-wide">
            Payment Cancelled
          </h1>
          
          <p className="text-[#000F32] mb-8 leading-relaxed">
            The checkout session was closed or the payment was not completed. Your registration has been saved as pending. You can try completing the transaction again.
          </p>
        </>
      )}
      
      <Link
        href="/"
        className="inline-block bg-[#670001] hover:bg-[#520001] text-white font-medium px-6 py-3 rounded transition-colors text-sm tracking-wide"
      >
        Return to Main Page
      </Link>
    </div>
  );
}