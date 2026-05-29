"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const [email, setEmail] = useState("lou.delgado.pfs@gmail.com");
  const [password, setPassword] = useState("");

  async function login() {
    try {
      if (!email || !password) {
        alert("Enter email and password.");
        return;
      }

      if (!supabaseUrl || !supabaseAnonKey) {
        alert("Missing Supabase URL or ANON KEY in .env.local.");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      window.location.href = "/crm";
    } catch (err: any) {
      alert(err.message || "Login failed.");
    }
  }

  async function createAccount() {
    try {
      if (!email || !password) {
        alert("Enter email and password.");
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      alert("Account created. Now click Login.");
    } catch (err: any) {
      alert(err.message || "Signup failed.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black p-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8">
        <h1 className="text-4xl font-black text-white">Team Avengers CRM</h1>
        <p className="mt-2 text-zinc-400">Login or create your account.</p>

        <input
          className="mt-6 w-full rounded-xl bg-black p-4 text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-xl bg-black p-4 text-white"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={login}
          className="mt-6 w-full rounded-xl bg-blue-600 p-4 font-bold text-white"
        >
          Login
        </button>

        <button
          type="button"
          onClick={createAccount}
          className="mt-4 w-full rounded-xl bg-green-600 p-4 font-bold text-white"
        >
          Create Account
        </button>
      </div>
    </main>
  );
}