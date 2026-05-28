import "./globals.css";
import type { Metadata } from "next";
import NavBar from "./_components/NavBar";

export const metadata: Metadata = {
  title: "Trouvez votre prochaine contenu",
  description: "Recommandations des films, séries et livres selon vos goûts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`h-full antialiased`}>
      <body className="min-h-full flex text-gray-50 bg-slate-950 w-screen overflow-x-hidden">
        <NavBar />
        <main className="flex-1 p-4">{children}</main>
      </body>
    </html>
  );
}
