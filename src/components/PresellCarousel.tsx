import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import s1 from "@/assets/presell-gads1.png.asset.json";
import s2 from "@/assets/presell-gads2.png.asset.json";
import s3 from "@/assets/presell-gads3.png.asset.json";
import s4 from "@/assets/presell-gads4.png.asset.json";
import s5 from "@/assets/presell-gads5.png.asset.json";
import s6 from "@/assets/presell-gads6.png.asset.json";
import s7 from "@/assets/presell-gads7.png.asset.json";
import s8 from "@/assets/presell-gads8.png.asset.json";
import s9 from "@/assets/presell-gads9.png.asset.json";

const slides = [s1, s2, s3, s4, s5, s6, s7, s8, s9];

export const PresellCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="w-full max-w-3xl mx-auto mb-10">
      <h2 className="text-center text-lg sm:text-xl font-bold text-gray-900 mb-4">
        Experimente criar Presells automáticas
      </h2>
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-lg bg-white">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <img
              key={i}
              src={slide.url}
              alt={`Exemplo de presell automática ${i + 1}`}
              loading="lazy"
              className="w-full shrink-0 object-cover"
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center gap-1.5 mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Ir para imagem ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-5 bg-[#0b57d0]" : "w-1.5 bg-gray-300"}`}
          />
        ))}
      </div>
      <div className="flex justify-center mt-5">
        <a
          href="https://presellgads.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-[#0b57d0] shadow-lg shadow-blue-500/30 hover:-translate-y-0.5 transition-all"
        >
          Criar minha presell automática <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
