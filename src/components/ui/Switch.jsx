import React from "react";

export default function Switch({ checked, onChange, label, id, disabled }) {
  return (
    <label
      className="flex items-center gap-2 cursor-pointer select-none"
      htmlFor={id}
    >
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      <span
        className={`w-10 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out transition-colors
          ${checked ? "bg-[#1de4bf]" : "bg-gray-200"}
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out transition-transform
            ${checked ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </span>
    </label>
  );
}
