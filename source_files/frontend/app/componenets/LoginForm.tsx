"use client";

import {useState} from "react";
import { login } from "../../lib/api";
import { useRouter } from "next/navigation";

function handleSubmit(event: React.FormEvent<HTMLFormElement>, email: string, password: string, setError: (error: string | null) => void, router: any) {
  event.preventDefault();
  // Handle form submission logic here
  login(email, password)
    .then(() => {
      // Login successful, redirect to home
      router.push('/');
      router.refresh();
    })
    .catch((err) => {
      setError(err instanceof Error ? err.message : "Login failed");
    });
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  function handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    setEmail(event.target.value);
    setError(null);
  }
  
  function handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
    setError(null);
  }
  return (
    <>
      <div className="bd-black flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="University of Oregon"
            src="../favicon.ico"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-black">Sign in to your account</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form onSubmit={(e) => handleSubmit(e, email, password, setError, router)} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-black-40">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  onChange={handleEmailChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#007030] sm:text-sm/6 border border-gray-300"
                  value={email}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-black-40">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-[#007030] hover:text-[#104735]">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  onChange={handlePasswordChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-black/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-[#007030] sm:text-sm/6 border border-gray-300"
                  value={password}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#007030] px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-[#104735] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007030]"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
