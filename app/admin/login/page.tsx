"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to dashboard and refresh server cache to recognize the new cookie
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Incorrect password.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 text-[#000F32]">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 w-full max-w-md">
        <h1 className="text-2xl font-serif font-bold text-[#670001] mb-2 text-center">Admin Portal Access</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Enter your credentials to manage registrations.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#000F32]/20 focus:border-[#000F32]"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#000F32] text-white py-2.5 rounded-md text-sm font-semibold hover:bg-[#000F32]/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}