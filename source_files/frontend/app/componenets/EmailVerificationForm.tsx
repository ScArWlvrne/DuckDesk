"use client";

import { useState } from "react";
import { verifyEmail } from "../../lib/api";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailVerificationForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!email) {
      setError("Email is missing. Please sign up again.");
      return;
    }

    if (!code.trim()) {
      setError("Verification code is required");
      return;
    }

    setLoading(true);
    try {
      await verifyEmail(email, code.trim());
      setSuccess(true);
      // Redirect to login after successful verification
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-[#007030] px-6 py-5">
            <div className="flex items-center gap-3">
              <img src="/favicon.ico" alt="UO" className="h-10 w-10" />
              <div>
                <h1 className="text-white text-lg font-bold">University of Oregon</h1>
                <p className="text-sm text-[#dff3e8]">DuckDesk — Verify Email</p>
              </div>
            </div>
          </div>
          <div className="bg-white px-6 py-6">
            {success ? (
              <div className="text-center space-y-4">
                <div className="rounded-md bg-green-50 p-4">
                  <p className="text-sm font-medium text-green-800">
                    Email verified successfully!
                  </p>
                </div>
                <p className="text-sm text-slate-600">
                  Redirecting to login page...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-md bg-slate-50 p-3 mb-4">
                  <p className="text-sm text-slate-600">
                    A verification code has been sent to:
                  </p>
                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {email || "your email address"}
                  </p>
                </div>

                {error && (
                  <div role="alert" aria-live="assertive" className="rounded-md bg-rose-50 p-3">
                    <p className="text-sm text-rose-700">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-slate-700">
                    Verification code
                  </label>
                  <div className="mt-1">
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      placeholder="Enter the code from your email"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007030] focus:ring-2 focus:ring-[#007030]/20"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-md bg-[#007030] px-4 py-2 text-sm font-semibold text-white hover:bg-[#104735] disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify Email"}
                  </button>
                </div>

                <p className="text-center text-xs text-slate-500">
                  Already have an account? <a href="/login" className="text-[#007030] font-medium">Sign in</a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
