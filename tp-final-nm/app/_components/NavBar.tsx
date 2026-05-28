import Link from "next/link";
import LoginCard from "./_client/LoginCard";
import { Heart, Sparkles, Telescope } from "lucide-react";
import { UserProvider } from "../_contexts/UserContext";

const paths = [
  { name: "Découvrir", href: "/", icon: Telescope },
  { name: "Mes favoris", href: "/favorites", icon: Heart },
  { name: "Recommandations", href: "/recommendations", icon: Sparkles },
];

export default function NavBar() {
  return (
    <nav className="bg-slate-800 text-white p-2 w-64">
      <UserProvider>
        <LoginCard />
      </UserProvider>
      <div className="flex flex-col py-6 gap-1">
        {paths.map((path) => (
          <Link
            key={path.href}
            href={path.href}
            className="text-lg hover:bg-blue-900 hover:underline rounded-t hover:rounded px-3 py-2 cursor-pointer transition border-b last:border-b-0 border-gray-700"
          >
            {path.icon && <path.icon className="inline-block mr-2" />}
            <span>{path.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
