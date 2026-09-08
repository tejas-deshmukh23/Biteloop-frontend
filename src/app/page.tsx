"use client";

import { useEffect, useRef, useState } from "react";
import { Fraunces, Work_Sans } from "next/font/google";
import Link from "next/link";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-fraunces",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-work-sans",
});

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: inView ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}

const ACTIVITY_MESSAGES = [
  "Priya's Kitchen just started on today's dal fry",
  "Amma's Tiffin is packing lunch for delivery",
  "3 kitchens near you are cooking right now",
  "Rajesh Mess added a fresh batch of rotis",
];

function LiveActivityCard() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);

      setTimeout(() => {
        setIndex((i) => (i + 1) % ACTIVITY_MESSAGES.length);
        setVisible(true);
      }, 300);
    }, 3200);

    return () => clearInterval(interval);
  }, []);

  return (
  <div className="absolute -top-4 -right-4 sm:-top-6 sm:-right-8 max-w-[250px] bg-white/95 backdrop-blur border border-[#2B2013]/10 rounded-2xl shadow-lg shadow-[#2B2013]/10 px-4 py-3 flex items-start gap-2.5 z-10">
    <span className="relative flex h-2.5 w-2.5 mt-1.5 shrink-0">
      <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-[#55713C] opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#55713C]" />
    </span>

    <p
      className={`text-sm leading-snug text-[#2B2013] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {ACTIVITY_MESSAGES[index]}
    </p>
  </div>
);
}

function CookingIllustration() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePointerMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: py * -8,
      y: px * 10,
    });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];

    if (!touch) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const px = (touch.clientX - rect.left) / rect.width - 0.5;
    const py = (touch.clientY - rect.top) / rect.height - 0.5;

    setTilt({
      x: py * -8,
      y: px * 10,
    });
  };

  const resetTilt = () => {
    setTilt({
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="relative w-full max-w-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(216,155,44,0.4)_0%,rgba(178,58,46,0.14)_45%,transparent_70%)] blur-3xl scale-110" />

      <div
        onMouseMove={handlePointerMove}
        onMouseLeave={resetTilt}
        onTouchMove={handleTouchMove}
        onTouchEnd={resetTilt}
        style={{ perspective: "900px" }}
        className="relative ambient-tilt-outer"
      >
        <div
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 200ms ease-out",
          }}
          className="drop-shadow-[0_40px_50px_rgba(178,58,46,0.22)]"
        >
          <svg
            viewBox="0 0 560 460"
            className="w-full h-auto scene-bob"
            role="img"
            aria-label="Illustration of a kadai cooking on a stove with rising steam, and a tiffin box waiting beside it"
          >
            {/* Stove */}

            <rect
              x="150"
              y="330"
              width="180"
              height="34"
              rx="8"
              fill="#2B2013"
            />

            <rect
              x="130"
              y="360"
              width="220"
              height="16"
              rx="6"
              fill="#241C15"
            />

            {/* Flame */}

            <path
              className="flame flame-outer"
              d="M240 330 C220 300, 235 275, 240 250 C255 280, 270 295, 255 330 Z"
              fill="#D89B2C"
            />

            <path
              className="flame flame-inner"
              d="M240 330 C228 308, 238 292, 240 275 C250 296, 258 305, 248 330 Z"
              fill="#B23A2E"
            />

            {/* Kadai */}

            <ellipse
              cx="240"
              cy="240"
              rx="115"
              ry="30"
              fill="#8B949A"
            />

            <path
              d="M125 240 Q125 300 240 305 Q355 300 355 240 Z"
              fill="#9BA3A8"
            />

            <ellipse
              cx="240"
              cy="238"
              rx="100"
              ry="24"
              fill="#D89B2C"
            />

            <ellipse
              cx="240"
              cy="234"
              rx="88"
              ry="18"
              fill="#E4AE49"
            />

            {/* Kadai handles */}

            <rect
              x="95"
              y="222"
              width="34"
              height="12"
              rx="6"
              fill="#6B7377"
            />

            <rect
              x="351"
              y="222"
              width="34"
              height="12"
              rx="6"
              fill="#6B7377"
            />

            {/* Spatula */}

            <path
              d="M290 230 L330 130"
              stroke="#8B5E34"
              strokeWidth="7"
              strokeLinecap="round"
            />

            <ellipse
              cx="333"
              cy="120"
              rx="12"
              ry="16"
              fill="#8B5E34"
            />

            {/* Steam */}

            <path
              className="steam steam-1"
              d="M210 190 C195 160, 220 145, 205 110"
              stroke="#F7F1E1"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            <path
              className="steam steam-2"
              d="M250 185 C235 155, 262 138, 248 100"
              stroke="#F7F1E1"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />

            <path
              className="steam steam-3"
              d="M180 195 C168 170, 188 158, 178 130"
              stroke="#F7F1E1"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />

            {/* Tiffin box */}

            <g transform="translate(390, 250)">
              <rect
                x="0"
                y="0"
                width="120"
                height="48"
                rx="10"
                fill="#B23A2E"
              />

              <rect
                x="0"
                y="0"
                width="120"
                height="10"
                rx="5"
                fill="#2B2013"
              />

              <rect
                x="0"
                y="52"
                width="120"
                height="48"
                rx="10"
                fill="#D89B2C"
              />

              <rect
                x="0"
                y="52"
                width="120"
                height="10"
                rx="5"
                fill="#2B2013"
              />

              <path
                d="M25 -10 Q60 -35 95 -10"
                stroke="#2B2013"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Decorative dots */}

            <circle
              cx="70"
              cy="150"
              r="6"
              fill="#B23A2E"
              opacity="0.6"
            />

            <circle
              cx="460"
              cy="140"
              r="8"
              fill="#55713C"
              opacity="0.6"
            />

            <circle
              cx="50"
              cy="280"
              r="5"
              fill="#D89B2C"
              opacity="0.6"
            />
          </svg>
        </div>
      </div>

      <LiveActivityCard />
    </div>
  );
}

export default function HomePage() {
  return (
    <div
      className={`${workSans.className} bg-[#FBF4EC] text-[#2B2013] min-h-screen overflow-x-hidden`}
    >
      <style jsx global>{`
        @media (prefers-reduced-motion: no-preference) {
          .ambient-tilt-outer {
            animation: ambientTilt 8s ease-in-out infinite;
          }

          .scene-bob {
            animation: sceneBob 4.5s ease-in-out infinite;
          }

          .steam {
            animation: steamRise 2.6s ease-in-out infinite;
            transform-origin: bottom;
          }

          .steam-2 {
            animation-delay: 0.5s;
          }

          .steam-3 {
            animation-delay: 1s;
          }

          .flame {
            animation: flameFlicker 1.1s ease-in-out infinite;
            transform-origin: bottom center;
          }

          .flame-inner {
            animation-delay: 0.2s;
          }

          .live-ping {
            animation: livePing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
          }

          .hero-enter {
            animation: heroEnter 0.7s ease-out both;
          }
        }

        @keyframes ambientTilt {
          0%,
          100% {
            transform: rotateX(3deg) rotateY(-5deg);
          }

          50% {
            transform: rotateX(-2deg) rotateY(5deg);
          }
        }

        @keyframes sceneBob {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes steamRise {
          0% {
            opacity: 0.15;
            transform: translateY(6px) scaleY(0.85);
          }

          50% {
            opacity: 0.75;
            transform: translateY(-6px) scaleY(1.1);
          }

          100% {
            opacity: 0.15;
            transform: translateY(6px) scaleY(0.85);
          }
        }

        @keyframes flameFlicker {
          0%,
          100% {
            transform: scaleY(1) scaleX(1);
          }

          50% {
            transform: scaleY(1.08) scaleX(0.95);
          }
        }

        @keyframes livePing {
          75%,
          100% {
            transform: scale(1.8);
            opacity: 0;
          }
        }

        @keyframes heroEnter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* 3D buttons */

        .btn-3d {
          position: relative;
          transform: translateY(0);
        }

        .btn-3d:active {
          transform: translateY(3px);
        }

        .btn-3d-primary {
          box-shadow:
            0 4px 0 #8f2a20,
            0 10px 20px -6px rgba(178, 58, 46, 0.45);
        }

        .btn-3d-primary:hover {
          box-shadow:
            0 5px 0 #8f2a20,
            0 14px 24px -6px rgba(178, 58, 46, 0.5);
        }

        .btn-3d-primary:active {
          box-shadow:
            0 1px 0 #8f2a20,
            0 4px 10px -4px rgba(178, 58, 46, 0.4);
        }

        .btn-3d-gold {
          box-shadow:
            0 4px 0 #a97a1f,
            0 10px 20px -6px rgba(216, 155, 44, 0.45);
        }

        .btn-3d-gold:hover {
          box-shadow:
            0 5px 0 #a97a1f,
            0 14px 24px -6px rgba(216, 155, 44, 0.5);
        }

        .btn-3d-gold:active {
          box-shadow:
            0 1px 0 #a97a1f,
            0 4px 10px -4px rgba(216, 155, 44, 0.4);
        }

        .btn-3d-outline {
          background: #fffaf3;
          box-shadow:
            0 4px 0 rgba(43, 32, 19, 0.16),
            0 8px 16px -8px rgba(43, 32, 19, 0.25);
        }

        .btn-3d-outline:hover {
          box-shadow:
            0 5px 0 rgba(43, 32, 19, 0.2),
            0 10px 18px -8px rgba(43, 32, 19, 0.28);
        }

        .btn-3d-outline:active {
          box-shadow:
            0 1px 0 rgba(43, 32, 19, 0.16),
            0 3px 8px -4px rgba(43, 32, 19, 0.2);
        }
      `}</style>

      {/* Navigation */}

      <div className="max-w-6xl mx-auto px-6 pt-5">
        <header className="flex items-center justify-between rounded-[28px] border border-[#2B2013]/10 bg-white/70 backdrop-blur-xl px-5 py-3.5 shadow-[0_18px_36px_-16px_rgba(43,32,19,0.28)]">
          <span className={`${fraunces.className} text-xl font-semibold`}>
            Biteloop
          </span>

          <nav className="hidden md:flex items-center gap-8 text-sm">
            <a
              href="#how-it-works"
              className="hover:text-[#B23A2E] transition-colors"
            >
              How it works
            </a>

            <a
              href="#for-businesses"
              className="hover:text-[#B23A2E] transition-colors"
            >
              For businesses
            </a>
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/login"
              className="text-sm hover:text-[#B23A2E] transition-colors"
            >
              Log in
            </Link>

            <Link
              href="/register"
              className="btn-3d btn-3d-primary bg-[#B23A2E] text-white text-sm font-medium px-4 py-2 rounded-full transition-transform"
            >
              Get started
            </Link>
          </div>
        </header>
      </div>

      {/* Hero */}

      {/* Hero */}

<section className="max-w-6xl mx-auto px-6 pt-6 sm:pt-8 pb-16 sm:pb-20">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center">

    {/* Hero text */}

    <div className="order-1 lg:order-1 lg:col-start-1 lg:row-start-1">
      <h1
        className={`${fraunces.className} hero-enter text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.05] font-semibold mb-5`}
      >
        Home-cooked food from the kitchen next door.
      </h1>

      <p
        className="hero-enter text-lg text-[#2B2013]/80 max-w-md leading-relaxed"
        style={{ animationDelay: "120ms" }}
      >
        Biteloop connects you with local tiffin services and home kitchens
        near you — real meals, made fresh, ordered in minutes.
      </p>
    </div>

    {/* Illustration */}

    <div
      className="order-2 lg:order-2 lg:col-start-2 lg:row-start-1 lg:row-span-2 flex justify-center lg:justify-end hero-enter"
      style={{ animationDelay: "180ms" }}
    >
      <CookingIllustration />
    </div>

    {/* CTA Buttons */}

    <div
      className="order-3 lg:order-3 lg:col-start-1 lg:row-start-2 hero-enter -mt-2 lg:-mt-4 flex flex-wrap gap-4"
      style={{ animationDelay: "240ms" }}
    >
      <Link
        href="/providers"
        className="btn-3d btn-3d-primary bg-[#B23A2E] text-white font-medium px-6 py-3 rounded-full transition-transform"
      >
        Browse kitchens near you
      </Link>

      <Link
        href="/register"
        className="btn-3d btn-3d-outline border border-[#2B2013]/15 font-medium px-6 py-3 rounded-full transition-transform"
      >
        List your kitchen
      </Link>
    </div>

  </div>
</section>

      {/* How it works */}

      <section id="how-it-works" className="bg-[#F4E9D8] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2
              className={`${fraunces.className} text-3xl font-semibold mb-12`}
            >
              How it works
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                num: "01",
                title: "Find a kitchen near you",
                body: "Browse local tiffin services and home kitchens by area.",
              },
              {
                num: "02",
                title: "Choose your meal",
                body: "See what's cooking today and place your order.",
              },
              {
                num: "03",
                title: "Get it delivered",
                body: "Track your order until it reaches your door.",
              },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 150}>
                <div>
                  <span
                    className={`${fraunces.className} text-4xl font-semibold text-[#D89B2C] block mb-3`}
                  >
                    {step.num}
                  </span>

                  <h3 className="font-semibold text-lg mb-2">
                    {step.title}
                  </h3>

                  <p className="text-[#2B2013]/75 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Biteloop */}

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2
              className={`${fraunces.className} text-3xl font-semibold mb-12`}
            >
              Why Biteloop
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#2B2013]/10">
            {[
              {
                title: "Real home cooking",
                body: "Meals made the way they're meant to be — not mass-produced, not reheated.",
              },
              {
                title: "Local and verified",
                body: "Every kitchen on Biteloop is a real local business, reviewed before it goes live.",
              },
              {
                title: "Order in minutes",
                body: "No calls, no waiting — browse, order, and know exactly where your food is.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 150}>
                <div
                  className={`py-6 md:py-0 ${
                    i > 0 ? "md:pl-10" : ""
                  } ${i < 2 ? "md:pr-10" : ""}`}
                >
                  <h3 className="font-semibold text-lg mb-2">
                    {item.title}
                  </h3>

                  <p className="text-[#2B2013]/75 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* For businesses */}

      <section
        id="for-businesses"
        className="bg-[#2B2013] text-[#FBF4EC] py-20"
      >
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h2
                  className={`${fraunces.className} text-3xl font-semibold mb-3`}
                >
                  Run a mess or tiffin service?
                </h2>

                <p className="text-[#FBF4EC]/75 max-w-md leading-relaxed">
                  List your kitchen on Biteloop and reach customers nearby who
                  are looking for home-style food.
                </p>
              </div>

              <Link
                href="/register"
                className="btn-3d btn-3d-gold bg-[#D89B2C] text-[#2B2013] font-medium px-6 py-3 rounded-full transition-transform whitespace-nowrap self-start md:self-auto"
              >
                List your kitchen
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}

      <footer className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#2B2013]/60">
        <span
          className={`${fraunces.className} text-base font-semibold text-[#2B2013]`}
        >
          Biteloop
        </span>

        <span>© 2026 Biteloop</span>
      </footer>
    </div>
  );
}