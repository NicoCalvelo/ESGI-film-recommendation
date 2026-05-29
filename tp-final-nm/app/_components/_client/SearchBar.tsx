"use client";

import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  collapsed?: boolean;
  initialValue?: string;
}

export default function SearchBar({ onSearch, collapsed = false, initialValue = "" }: SearchBarProps) {
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(val.trim());
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className={`w-full transition-all duration-500 ${collapsed ? "max-w-2xl" : "max-w-xl"}`}>
      <div className="relative">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="Rechercher films, séries, animés, livres…"
          autoFocus={!collapsed}
          className={`w-full bg-gray-800/80 border border-gray-600 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-300 ${
            collapsed ? "pl-11 pr-5 py-3 text-base" : "pl-12 pr-6 py-4 text-lg"
          }`}
        />
      </div>
    </div>
  );
}
