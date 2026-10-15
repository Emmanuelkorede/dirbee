"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

type SplashScreenProps = {
  duration?: number;
};

const SPLASH_SESSION_KEY = "house-of-bee-splash-seen";

export function SplashScreen({
  duration = 1700,
}: SplashScreenProps) {
  // Starts visible so the server and the browser render the same thing.
  // Repeat visitors never see it: the inline script in app/layout.tsx
  // hides it with CSS before the first paint.
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let alreadySeen = false;

    try {
      alreadySeen =
        sessionStorage.getItem(SPLASH_SESSION_KEY) === "true";
    } catch {
      // Continue without session storage if unavailable.
    }

    if (alreadySeen) {
      setIsVisible(false);
      return;
    }

    const timeout = window.setTimeout(
      () => {
        try {
          sessionStorage.setItem(SPLASH_SESSION_KEY, "true");
        } catch {
          // The splash will still work without session storage.
        }

        setIsVisible(false);
      },
      prefersReducedMotion ? 650 : duration
    );

    return () => window.clearTimeout(timeout);
  }, [duration, prefersReducedMotion]);

  const pathTransition = prefersReducedMotion
    ? { duration: 0.15 }
    : {
        type: "spring" as const,
        stiffness: 170,
        damping: 18,
      };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="house-of-bee-splash"
          data-splash=""
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 1.025,
          }}
          transition={{
            duration: prefersReducedMotion ? 0.15 : 0.45,
            ease: "easeInOut",
          }}
          aria-hidden="true"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 500 500"
            fill="none"
            style={{
              width: "clamp(120px, 24vw, 220px)",
              height: "clamp(120px, 24vw, 220px)",
            }}
            initial={{ scale: prefersReducedMotion ? 1 : 0.92 }}
            animate={{ scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.15 : 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {/* Upper part moves in from the left */}
            <motion.path
              d="M95 145 L250 55 L425 155
                 C448 168 455 194 444 215
                 C439 225 432 233 421 240
                 C410 227 394 222 375 222
                 H275 V175 L185 122 V445 H95 Z"
              fill="var(--foreground)"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: -22, y: -12 }
              }
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                ...pathTransition,
                delay: prefersReducedMotion ? 0 : 0.05,
              }}
            />

            {/* Lower part moves in from the right */}
            <motion.path
              d="M275 305
                 H375
                 C419 305 445 332 445 375
                 C445 418 419 445 375 445
                 H275 Z"
              fill="var(--foreground)"
              initial={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, x: 22, y: 12 }
              }
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{
                ...pathTransition,
                delay: prefersReducedMotion ? 0 : 0.12,
              }}
            />
          </motion.svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}