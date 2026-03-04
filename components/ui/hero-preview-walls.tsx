"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
  image: string;
};

let interval: ReturnType<typeof setInterval> | undefined;

export const CardSlide = ({
  items,
  offset = 22,
  scaleFactor = 0.06,
  intervalDuration = 3000,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
  intervalDuration?: number;
}) => {
  const [cards, setCards] = useState<Card[]>(items);
  const [dynamicOffset, setDynamicOffset] = useState(offset);
  const [dynamicScale, setDynamicScale] = useState(scaleFactor);
  const [cardSize, setCardSize] = useState({ height: "26rem", width: "22rem" });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window === "undefined") return;
      if (window.innerWidth < 640) {
        setDynamicOffset(10);
        setDynamicScale(0.04);
        setCardSize({ height: "26rem", width: "26rem" });
      } else if (window.innerWidth < 1024) {
        setDynamicOffset(14);
        setDynamicScale(0.05);
        setCardSize({ height: "30rem", width: "28rem" });
      } else {
        setDynamicOffset(offset);
        setDynamicScale(scaleFactor);
        setCardSize({ height: "32rem", width: "32rem" });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [offset, scaleFactor]);

  useEffect(() => {
    interval = setInterval(() => {
      setCards((prev) => {
        const arr = [...prev];
        arr.unshift(arr.pop()!);
        return arr;
      });
    }, intervalDuration);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [intervalDuration]);

  return (
    <div
      className="relative flex justify-center"
      style={{
        height: `calc(${cardSize.height} + ${cards.length * dynamicOffset}px)`,
        width: cardSize.width,
      }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl dark:border-white/[0.08] dark:bg-neutral-900 sm:p-6 md:p-8 flex flex-col justify-between text-left overflow-hidden"
          style={{
            transformOrigin: "top center",
            height: cardSize.height,
            width: cardSize.width,
          }}
          animate={{
            top: index * -dynamicOffset,
            scale: 1 - index * dynamicScale,
            zIndex: cards.length - index,
          }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="space-y-3 sm:space-y-4">
            <div className="font-semibold text-lg text-neutral-800 dark:text-neutral-100 sm:text-xl md:text-2xl">
              {card.name}
            </div>
            <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 sm:text-base">
              {card.content}
            </div>

            <div className="mt-3">
              <img
                src={card.image}
                alt={card.name}
                className="h-40 w-full rounded-lg border border-neutral-200 object-cover shadow-md dark:border-neutral-800 sm:h-48 md:h-56"
              />
            </div>
          </div>

          <div className="mt-4 border-t border-neutral-200 pt-3 dark:border-neutral-800">
            <p className="text-sm font-medium text-neutral-700 dark:text-white sm:text-base">
              {card.designation}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
