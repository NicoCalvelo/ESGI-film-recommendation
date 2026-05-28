"use client";

export default function OutlinedButton({
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
        "border border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg rounded-tl-2xl hover:bg-blue-100 transition " +
        (hasIcon ? " pl-3 pr-4 " : "")
      }
    >
      {children}
    </button>
  );
}
