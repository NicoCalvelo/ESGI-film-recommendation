"use client";

export default function FilledButton({
  children,
  onClick,
  hasIcon = false,
}: Readonly<{
  children: React.ReactNode;
  onClick?: () => void;
  hasIcon?: boolean;
}>) {
  return (
    <button
      onClick={onClick}
      className={
        "from-blue-800 to-blue-600 bg-gradient-to-r text-white font-semibold py-2 px-4 rounded-lg rounded-tr-2xl border hover:from-blue-700 hover:to-blue-500 transition " +
        (hasIcon ? " pl-3 pr-4 " : "")
      }
    >
      {children}
    </button>
  );
}
