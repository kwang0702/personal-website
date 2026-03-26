"use client";

import Link from "next/link";
import { useState } from "react";
import { useAdmin } from "@/components/admin-provider";
import { useLanguage } from "@/components/language-provider";

export default function AdminLogin() {
  const { isAdmin, login, logout } = useAdmin();
  const { t } = useLanguage();
  const [showPrompt, setShowPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAdmin) {
      logout();
    } else {
      setShowPrompt(true);
    }
  };

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

  return (
    <>
      <Link
        href="/"
        onDoubleClick={handleDoubleClick}
        className="font-serif text-2xl font-semibold tracking-tight text-charcoal transition-colors hover:text-royal-green select-none"
      >
        K. Wang
        {isAdmin && (
          <span className="ml-2 align-middle text-[10px] font-sans font-medium tracking-wide text-royal-green/50">
            {t("admin.badge")}
          </span>
        )}
      </Link>

      {showPrompt && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm"
          onClick={() => { setShowPrompt(false); setError(false); setPassword(""); }}
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col gap-3 rounded-sm bg-cream p-6 shadow-xl w-72"
          >
            <p className="font-serif text-sm font-medium text-charcoal">{t("admin.login_title")}</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("admin.password_placeholder")}
              className={`rounded-sm border px-3 py-2 text-sm bg-transparent focus:outline-none focus:border-royal-green ${
                error ? "border-burgundy" : "border-charcoal/15"
              }`}
              autoFocus
            />
            {error && (
              <p className="text-xs text-burgundy">{t("admin.wrong_password")}</p>
            )}
            <button
              type="submit"
              className="rounded-sm bg-royal-green px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-royal-green/90"
            >
              {t("admin.login_button")}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
