"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@/app/_contexts/UserContext";
import FilledButton from "../_buttons/FilledButton";
import FormInput from "../_form/FormInput";

interface Props {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export default function SignUpModal({ onClose, onSwitchToLogin }: Props) {
  const { signUp } = useUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = signUp(name, email, password);
    if (err) {
      setError(err);
    } else {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-sm shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-bold mb-4">Créer un compte</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <FormInput
            label="Nom"
            value={name}
            onChange={setName}
            placeholder="Jean Dupont"
            required
          />
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
            minLength={6}
          />

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <FilledButton>S'inscrire</FilledButton>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Déjà un compte ?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}
