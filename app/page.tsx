"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  const [amount, setAmount] = useState<string>("20"); // Defaults to 20, but can be changed
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "",
    parishDiocese: "",
    primaryRole: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, amount }), // 👈 FIX: Added amount here
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server error: ${response.status}`);
      }

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Payment gateway URL was not returned by the server.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#000F32]">
   
      {/* 1. Fully Responsive Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-[#998443]/20 shadow-sm backdrop-blur-md bg-[#FDFBF7]/95">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 sm:h-20 md:h-24 flex items-center justify-between gap-4">
          
          <a href="#" className="relative w-60 h-20 sm:w-56 sm:h-12 md:w-64 md:h-14 flex-shrink-0 transition-transform hover:scale-[1.01]">
            <Image
              src="/logo-dark-removebg.png"
              alt="Catholic Online Class Logo"
              fill
              priority
              className="object-contain object-left"
              sizes="(max-w-640px) 176px, (max-w-768px) 224px, 256px"
            />
          </a>

          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-[#000F32]/80">
            <a href="#program-details" className="hover:text-[#670001] transition-colors">The Program</a>
            <a href="#admission-form" className="hover:text-[#670001] transition-colors">Admissions</a>
          </div>

          <div>
            <Link 
              href="/admin" 
              className="bg-[#000F32] hover:bg-[#000F32]/90 text-white font-medium text-sm px-5 py-2.5 rounded transition-all tracking-wide inline-block"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </nav>
  
      {/* 2. Hero Banner */}
      <header className="bg-[#670001] text-white py-16 md:py-24 px-4 relative overflow-hidden border-b-4 border-[#998443]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(153,132,67,0.2)_0%,transparent_60%)]" />
        
        <div className="relative max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start text-left">
            
            <div className="relative w-70 h-25 sm:w-56 sm:h-12 md:w-64 md:h-14 mb-6 opacity-95">
              <Image 
                src="/logo.png" 
                alt="Catholic Online Class" 
                fill 
                className="object-contain object-left brightness-0 invert" 
                sizes="(max-w-640px) 192px, 256px"
              />
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6 tracking-wide leading-tight">
              Deepen Your Faith. <br />
              <span className="italic text-[#998443]">Equip Your Ministry.</span>
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-xl mb-8 leading-relaxed">
              Join our flagship six-month Catechist Formation Program. Rooted in sacred Catholic wisdom, doctrine, and tradition—built seamlessly for an online global community.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#admission-form"
                className="bg-[#998443] hover:bg-[#857239] text-[#000F32] font-semibold px-8 py-3.5 rounded transition-all tracking-wide shadow-md"
              >
                Apply & Register {/* 👈 Removed hardcoded $20 */}
              </a>
              <a
                href="#program-details"
                className="border border-white/30 hover:border-white hover:bg-white/5 text-white font-medium px-6 py-3.5 rounded transition-all tracking-wide"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-[3/4] bg-[#000F32] rounded-lg shadow-2xl p-2 border-2 border-[#998443]/40 overflow-hidden group">
              <div className="absolute inset-3 border border-[#998443]/20 pointer-events-none z-10" />
              
              <Image 
                src="/post.png" 
                alt="St. Thomas Aquinas - Catholics Online Class"
                fill
                priority
                className="object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-700"
                sizes="(max-w-768px) 100vw, 450px"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#000F32]/80 via-transparent to-transparent z-0" />
            </div>
          </div>
        </div>
      </header>

      {/* 3. Program Details Section */}
      <section id="program-details" className="max-w-6xl mx-auto py-20 px-4 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-serif text-[#670001] mb-5 font-bold tracking-wide">
            Catechist Formation Program
          </h2>
          <p className="mb-6 leading-relaxed text-gray-700">
            This comprehensive program is open to catechists, Catholic teachers, converts, parish leaders, parents, and any Catholic wishing to grow deeply rooted in church tradition and doctrine.
          </p>
          <ul className="space-y-4 font-medium text-sm md:text-base text-[#000F32]/90">
            <li className="flex items-start gap-3">
              <span className="text-[#998443] text-xl leading-none">✔</span> 
              <span><strong>100% Online & Flexible:</strong> Structured to fit busy schedules across international time zones.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#998443] text-xl leading-none">✔</span> 
              <span><strong>Deep Theological Grounding:</strong> Covers Scripture, Creed, Sacraments, and Catechetical Methods.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#998443] text-xl leading-none">✔</span> 
              <span><strong>Official Credential:</strong> Receive a certified official Certificate of Completion upon finishing.</span>
            </li>
          </ul>
        </div>

        {/* Secure Admission & Payment Form */}
        <div id="admission-form" className="bg-white border border-gray-100 p-8 rounded-lg shadow-xl relative scroll-mt-24">
          <div className="flex flex-col items-start gap-1 mb-6 border-b border-gray-100 pb-4">
            <div className="relative w-60 h-20 mb-2">
              <Image 
                src="/logo-dark-removebg.png" 
                alt="Catholic Online Class" 
                fill 
                className="object-contain object-left" 
                sizes="192px"
              />
            </div>
            <h3 className="text-xl font-serif text-[#670001] font-bold">Admission & Registration</h3>
            <p className="text-xs text-gray-500">Complete your details to proceed to secure international payment.</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm font-medium border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 👈 FIX: Moved the Amount Field inside the Form Tag */}
            <div>
             <label htmlFor="amount" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
  Amount to Pay (₦)
</label>
              <input
                id="amount"
                type="number"
                min="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-200 rounded px-3 py-2.5 bg-[#FDFBF7]/50 focus:outline-none focus:border-[#670001] focus:bg-white text-sm text-black"
                required
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Full Name (for certificate)</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2.5 bg-[#FDFBF7]/50 focus:outline-none focus:border-[#670001] focus:bg-white text-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded px-3 py-2.5 bg-[#FDFBF7]/50 focus:outline-none focus:border-[#670001] focus:bg-white text-sm"
                placeholder="john@example.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 bg-[#FDFBF7]/50 focus:outline-none focus:border-[#670001] focus:bg-white text-sm"
                  placeholder="United Kingdom"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Parish & Diocese</label>
                <input
                  type="text"
                  name="parishDiocese"
                  required
                  value={formData.parishDiocese}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded px-3 py-2.5 bg-[#FDFBF7]/50 focus:outline-none focus:border-[#670001] focus:bg-white text-sm"
                  placeholder="St. Mary's Parish"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Primary Role</label>
              <select
                name="primaryRole"
                required
                value={formData.primaryRole}
                onChange={handleChange}
                className="w-full border border-gray-200 bg-[#FDFBF7]/50 rounded px-3 py-2.5 focus:outline-none focus:border-[#670001] focus:bg-white text-sm"
              >
                <option value="">Select your role...</option>
                <option value="Catechist">Catechist / Youth Leader</option>
                <option value="Teacher">Catholic School Teacher</option>
                <option value="Parent">Parent</option>
                <option value="ParishStaff">Parish Staff / Leader</option>
                <option value="Other">Other Catholic / Clergy</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#670001] hover:bg-[#520001] text-white font-medium py-3 rounded transition-colors disabled:opacity-50 mt-2 tracking-wide shadow-sm text-sm"
            >
              {/* 👈 FIX: Made the checkout text dynamic to display the state input */}
             {loading ? "Processing Secure Gateway..." : `Proceed to Secure Payment (₦${amount || "0"})`}  </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-xs text-gray-400 inline-flex items-center gap-1">
               🔒 Secure global transaction processed via Flutterwave
             </span>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="bg-[#000F32] text-white/70 py-8 border-t-4 border-[#998443]">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          
          <div className="relative w-48 h-12 opacity-80">
            <Image
              src="/logo.png"
              alt="Catholic Online Class"
              fill
              className="object-contain object-left brightness-0 invert"
              sizes="192px"
            />
          </div>

          <div className="text-center sm:text-right font-medium tracking-wide">
            <p>&copy; {new Date().getFullYear()} Catholic Online Class. All rights reserved.</p>
          </div>

        </div>
      </footer>
 
    </div>
  );
}