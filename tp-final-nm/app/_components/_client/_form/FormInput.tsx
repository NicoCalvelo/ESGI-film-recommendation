"use client";

interface Props {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}

export default function FormInput({ label, type = "text", value, onChange, placeholder, required, minLength }: Props) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        className="w-full rounded-lg rounded-tr-2xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm outline-none focus:border-blue-500"
      />
    </div>
  );
}
