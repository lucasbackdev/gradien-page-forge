import { useEffect, useState } from "react";
import { X } from "lucide-react";
import planos from "@/assets/planos.png.asset.json";

export const PlansPopup = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const first = setTimeout(() => setOpen(true), 30000);
    const repeat = setInterval(() => setOpen(true), 5 * 60 * 1000);
    return () => {
      clearTimeout(first);
      clearInterval(repeat);
    };
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-3xl">
        <button
          onClick={() => setOpen(false)}
          aria-label="Fechar"
          className="absolute -top-3 -right-3 z-10 h-9 w-9 rounded-full bg-white text-gray-900 shadow-lg flex items-center justify-center hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
        <a href="https://presellgads.io" target="_blank" rel="noopener noreferrer">
          <img src={planos.url} alt="Planos Presell Gads" className="w-full rounded-2xl shadow-2xl" />
        </a>
      </div>
    </div>
  );
};
