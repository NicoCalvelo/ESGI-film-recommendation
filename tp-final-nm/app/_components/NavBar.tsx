import Link from "next/link";
import LoginCard from "./_client/LoginCard";
import { Home, MonitorPlay, Clapperboard, Book } from "lucide-react";
import { UserProvider } from "../_contexts/UserContext";

const paths = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Films", href: "/movies", icon: Clapperboard },
  { name: "Séries", href: "/series", icon: MonitorPlay },
  { name: "Livres", href: "/books", icon: Book },
];

export default function NavBar() {
  return (
    <nav className="bg-slate-800 text-white p-2 w-64">
      <UserProvider>
        <LoginCard />
      </UserProvider>
      <ul className="flex flex-col py-6">
        {paths.map((path) => (
          <li
            key={path.href}
            className="text-lg hover:bg-blue-900 hover:underline rounded px-3 py-2 cursor-pointer transition border-b last:border-b-0 border-gray-700"
          >
            {path.icon && <path.icon className="inline-block mr-2" />}
            <Link href={path.href}>{path.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
