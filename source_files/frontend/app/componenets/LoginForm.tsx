"use client";

import { useState } from "react";
import { login } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email.trim(), password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
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
                <p className="text-sm text-[#dff3e8]">DuckDesk — Sign in</p>
              </div>
            </div>
          </div>
          <div className="bg-white px-6 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div role="alert" aria-live="assertive" className="rounded-md bg-rose-50 p-3">
                  <p className="text-sm text-rose-700">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007030] focus:ring-2 focus:ring-[#007030]/20"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="text-sm">
                    <a href="#" className="font-medium text-[#007030] hover:text-[#104735]">
                      Forgot?
                    </a>
                  </div>
                </div>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <p className="text-center text-xs text-slate-500">
                Need an account? <a href="/signup" className="text-[#007030] font-medium">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
