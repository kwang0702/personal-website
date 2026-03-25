"use client";

import { useState } from "react";
import { useAdmin } from "@/components/admin-provider";

export default function AdminToggle() {
  const { isAdmin, login, logout } = useAdmin();
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const ok = await login(password);
    if (ok) {
      setShowPrompt(false);
      setPassword("");
    } else {
      setError(true);
    }
  };

  if (isAdmin) {
    return (
      <button
        onClick={logout}
        className="text-xs font-medium text-royal-green/60 transition-colors hover:text-royal-green"
        title="Logout admin"
      >
        Admin
      </button>
    );
  }

  return (
    <>
      {/* Subtle trigger — triple-click to open */}
      <button
        onClick={() => setShowPrompt(true)}
        className="h-4 w-4 opacity-0 hover:opacity-20 transition-opacity"
        aria-label="Admin login"
      />

      {showPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 backdrop-blur-sm"
          onClick={() => { setShowPrompt(false); setError(false); }}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col gap-3 rounded-sm bg-cream p-6 shadow-xl"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className={`rounded-sm border px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-royal-green ${
                error ? "border-burgundy" : "border-charcoal/15"
              }`}
              autoFocus
            />
            <button
              type="submit"
              className="rounded-sm bg-royal-green px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-royal-green/90"
            >
              Login
            </button>
          </form>
        </div>
      )}
    </>
  );
}
