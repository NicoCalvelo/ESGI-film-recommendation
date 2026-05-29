"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors mb-8"
    >
      <span className="text-lg leading-none">←</span>
      Retour à la recherche
    </button>
  );
}
