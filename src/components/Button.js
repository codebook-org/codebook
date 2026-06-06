"use client";

export default function Button({
  text,
  onClick,
  type = "button",
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-white text-black px-10 py-4 rounded-lg hover:bg-zinc-400 cursor-pointer ${className}`}
    >
      {text}
    </button>
  );
}
