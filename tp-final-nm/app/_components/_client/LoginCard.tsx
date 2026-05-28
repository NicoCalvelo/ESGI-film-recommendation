import { CircleUser } from "lucide-react";

export default function LoginCard() {
  return (
    <div className="border rounded-lg p-4 shadow-md">
      <CircleUser size={48} className="mx-auto mb-4 text-gray-500" />
      <h2 className="text-xl font-semibold text-center mb-4">Bienvenue !</h2>
      <p className="text-center text-gray-600 mb-6">
        Connectez-vous pour accéder à vos recommandations personnalisées.
      </p>
      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Se connecter</button>
    </div>
  );
}
