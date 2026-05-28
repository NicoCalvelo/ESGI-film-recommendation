"use client";

import { useState, SubmitEvent } from "react";
import { X } from "lucide-react";
import { useUser } from "@/app/_contexts/UserContext";
import FilledButton from "../_buttons/FilledButton";
import FormInput from "../_form/FormInput";

interface Props {
  onClose: () => void;
  onSwitchToSignUp: () => void;
}

export default function LoginModal({ onClose, onSwitchToSignUp }: Props) {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    const err = login(email, password);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-sm shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-4">Se connecter</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="jean@example.com"
            required
          />
          <FormInput
            label="Mot de passe"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            required
          />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <FilledButton>Se connecter</FilledButton>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Pas encore de compte ?{" "}
          <button onClick={onSwitchToSignUp} className="text-blue-400 hover:underline">
            S'inscrire
          </button>
        </p>
      </div>
    </div>
  );
}
