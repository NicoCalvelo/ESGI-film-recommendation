"use client";

import { useState } from "react";
import { CircleUser, Dot, LogOut } from "lucide-react";
import { useUser } from "@/app/_contexts/UserContext";
import FilledButton from "./_buttons/FilledButton";
import LoginModal from "./_modals/LoginModal";
import SignUpModal from "./_modals/SignUpModal";

type Modal = "login" | "signup" | null;

export default function LoginCard() {
  const { user, logout } = useUser();
  const [openModal, setOpenModal] = useState<Modal>(null);

  return (
    <>
      <div className="border rounded-lg p-4 shadow-md">
        <div className="flex gap-2 mb-1 items-start">
          <CircleUser size={24} className="text-gray-300 flex-shrink-0" />
          <h2 className="font-semibold">{user ? `${user.name}` : "Bienvenue !"}</h2>
        </div>
        {user ? (
          <div className="flex gap-3 items-center mt-2">
            <span className="text-xs text-gray-400 truncate">{user.email}</span>
            <button
              onClick={logout}
              className="flex flex-shrink-0 items-center gap-1 text-xs text-gray-400 hover:text-white transition"
            >
              <LogOut size={14} />
              Se déconnecter
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-300 mb-4">
              Connectez-vous pour accéder à vos recommandations personnalisées.
            </p>
            <FilledButton onClick={() => setOpenModal("login")}>Se connecter</FilledButton>
          </>
        )}
      </div>

      {openModal === "login" && (
        <LoginModal onClose={() => setOpenModal(null)} onSwitchToSignUp={() => setOpenModal("signup")} />
      )}
      {openModal === "signup" && (
        <SignUpModal onClose={() => setOpenModal(null)} onSwitchToLogin={() => setOpenModal("login")} />
      )}
    </>
  );
}
