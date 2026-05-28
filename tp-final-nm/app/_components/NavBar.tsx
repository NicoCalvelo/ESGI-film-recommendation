import Link from "next/link";
import LoginCard from "./_client/LoginCard";

const paths = [
  { name: "Accueil", href: "/" },
  { name: "Films", href: "/movies" },
  { name: "Séries", href: "/series" },
  { name: "Livres", href: "/books" },
];

export default function NavBar() {
  return (
    <nav className="bg-slate-800 text-white p-4 w-min">
      <LoginCard />
      <ul className="flex flex-col gap-4">
        {paths.map((path) => (
          <li key={path.href} className="text-lg hover:bg-blue-900 rounded px-2 py-1 transition">
            <Link href={path.href}>{path.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
