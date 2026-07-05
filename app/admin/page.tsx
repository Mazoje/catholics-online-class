import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

// Initializes cleanly now that NEXT_PUBLIC_SUPABASE_URL is fixed in Vercel
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export default async function AdminPortal() {
  // 1. Verify the admin cookie exists and is valid
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "authenticated") {
    redirect("/admin/login");
  }

  // 2. Clear cookie session on log out
  async function handleLogout() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    redirect("/admin/login");
  }

  // 3. Fetch logs directly from the synchronized database table
  const { data: registrations, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 md:p-12 text-[#000F32]">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#670001] mb-2">Registration Dashboard</h1>
            <p className="text-sm text-gray-600">Track student admissions and program payment states.</p>
          </div>
          
          {/* Logout Action Button */}
          <form action={handleLogout}>
            <button 
              type="submit" 
              className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded text-xs font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Log Out
            </button>
          </form>
        </header>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-100 text-sm">
            Failed to parse records: {error.message}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100/70 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Country</th>
                  <th className="p-4">Parish / Diocese</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Payment Status</th>
                  <th className="p-4">Registration Date</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100">
                {registrations?.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-900 whitespace-nowrap">{student.full_name}</td>
                    <td className="p-4 text-gray-600 whitespace-nowrap">{student.email}</td>
                    <td className="p-4 text-gray-700 whitespace-nowrap">{student.country}</td>
                    <td className="p-4 text-gray-600 whitespace-nowrap">{student.parish_diocese}</td>
                    <td className="p-4 text-gray-700 whitespace-nowrap">{student.primary_role}</td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                        student.payment_status === "completed" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {student.payment_status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(student.created_at).toLocaleDateString(undefined, {
                        year: 'numeric', month: 'short', day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
                {(!registrations || registrations.length === 0) && (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-gray-400 font-medium">
                      No program registration logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}