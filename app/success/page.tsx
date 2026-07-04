// app/success/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="max-w-xl mx-auto text-center bg-white p-10 rounded-lg shadow-xl border border-gray-100">
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
        
        {sessionId && (
          <div className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-200 break-all">
            Stripe Transaction ID: {sessionId}
          </div>
        )}
      </div>
      
      <Link
        href="/"
        className="inline-block bg-[#670001] hover:bg-[#520001] text-white font-medium px-6 py-3 rounded transition-colors text-sm tracking-wide"
      >
        Return to Main Page
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center px-4 py-12">
      {/* Next.js App Router requires useSearchParams to be wrapped in a Suspense boundary */}
      <Suspense fallback={<div className="text-[#000F32] font-medium">Loading confirmation...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}