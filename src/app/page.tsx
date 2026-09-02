export default function Home() {
  const foodItems = [
    // Main food items
    {
      food: "🍛",
      left: "3%",
      delay: "-2s",
      duration: "9s",
      size: "34px",
      drift: ["20px", "-30px", "35px", "-10px"],
      opacity: 0.65,
      rotate: ["-12deg", "8deg", "25deg"],
    },
    {
      food: "🥟",
      left: "9%",
      delay: "-7s",
      duration: "12s",
      size: "27px",
      drift: ["-25px", "30px", "-10px", "20px"],
      opacity: 0.45,
      rotate: ["15deg", "-12deg", "30deg"],
    },
    {
      food: "🍲",
      left: "16%",
      delay: "-5s",
      duration: "10s",
      size: "32px",
      drift: ["30px", "-15px", "25px", "-30px"],
      opacity: 0.7,
      rotate: ["-8deg", "15deg", "40deg"],
    },
    {
      food: "🌮",
      left: "23%",
      delay: "-9s",
      duration: "13s",
      size: "29px",
      drift: ["-20px", "25px", "-35px", "15px"],
      opacity: 0.5,
      rotate: ["20deg", "-10deg", "35deg"],
    },
    {
      food: "🍚",
      left: "30%",
      delay: "-12s",
      duration: "11s",
      size: "31px",
      drift: ["15px", "-25px", "30px", "-20px"],
      opacity: 0.55,
      rotate: ["-15deg", "12deg", "28deg"],
    },
    {
      food: "🥗",
      left: "37%",
      delay: "-6s",
      duration: "14s",
      size: "28px",
      drift: ["-30px", "20px", "-15px", "30px"],
      opacity: 0.45,
      rotate: ["10deg", "-20deg", "30deg"],
    },
    {
      food: "🍜",
      left: "44%",
      delay: "-3s",
      duration: "10s",
      size: "33px",
      drift: ["25px", "-20px", "35px", "-15px"],
      opacity: 0.65,
      rotate: ["-10deg", "18deg", "35deg"],
    },
    {
      food: "🫓",
      left: "51%",
      delay: "-11s",
      duration: "12s",
      size: "30px",
      drift: ["-15px", "30px", "-25px", "15px"],
      opacity: 0.55,
      rotate: ["18deg", "-15deg", "25deg"],
    },
    {
      food: "🍱",
      left: "58%",
      delay: "-4s",
      duration: "13s",
      size: "34px",
      drift: ["20px", "-30px", "20px", "-25px"],
      opacity: 0.6,
      rotate: ["-8deg", "15deg", "32deg"],
    },
    {
      food: "🥘",
      left: "65%",
      delay: "-10s",
      duration: "11s",
      size: "31px",
      drift: ["-25px", "20px", "-30px", "10px"],
      opacity: 0.7,
      rotate: ["15deg", "-10deg", "35deg"],
    },
    {
      food: "🍳",
      left: "72%",
      delay: "-8s",
      duration: "14s",
      size: "30px",
      drift: ["30px", "-20px", "25px", "-15px"],
      opacity: 0.5,
      rotate: ["-12deg", "20deg", "40deg"],
    },
    {
      food: "🥙",
      left: "79%",
      delay: "-1s",
      duration: "10s",
      size: "29px",
      drift: ["-20px", "25px", "-30px", "20px"],
      opacity: 0.6,
      rotate: ["10deg", "-18deg", "30deg"],
    },
    {
      food: "🍲",
      left: "86%",
      delay: "-7s",
      duration: "12s",
      size: "33px",
      drift: ["25px", "-30px", "15px", "-25px"],
      opacity: 0.65,
      rotate: ["-15deg", "12deg", "35deg"],
    },
    {
      food: "🥟",
      left: "94%",
      delay: "-13s",
      duration: "13s",
      size: "26px",
      drift: ["-30px", "15px", "-20px", "30px"],
      opacity: 0.45,
      rotate: ["20deg", "-10deg", "28deg"],
    },

    // Smaller background ingredients
    {
      food: "🌶️",
      left: "6%",
      delay: "-15s",
      duration: "11s",
      size: "21px",
      drift: ["35px", "-20px", "25px", "-15px"],
      opacity: 0.4,
      rotate: ["-20deg", "10deg", "30deg"],
    },
    {
      food: "🍋",
      left: "14%",
      delay: "-11s",
      duration: "14s",
      size: "20px",
      drift: ["-25px", "20px", "-15px", "30px"],
      opacity: 0.35,
      rotate: ["15deg", "-20deg", "40deg"],
    },
    {
      food: "🌿",
      left: "20%",
      delay: "-16s",
      duration: "12s",
      size: "22px",
      drift: ["20px", "-30px", "20px", "-10px"],
      opacity: 0.35,
      rotate: ["-10deg", "25deg", "45deg"],
    },
    {
      food: "🍅",
      left: "27%",
      delay: "-14s",
      duration: "13s",
      size: "22px",
      drift: ["-20px", "30px", "-25px", "20px"],
      opacity: 0.4,
      rotate: ["20deg", "-15deg", "30deg"],
    },
    {
      food: "🌶️",
      left: "34%",
      delay: "-18s",
      duration: "15s",
      size: "20px",
      drift: ["30px", "-25px", "20px", "-20px"],
      opacity: 0.35,
      rotate: ["-15deg", "20deg", "35deg"],
    },
    {
      food: "🍋",
      left: "69%",
      delay: "-12s",
      duration: "12s",
      size: "21px",
      drift: ["-30px", "20px", "-25px", "15px"],
      opacity: 0.4,
      rotate: ["15deg", "-20deg", "30deg"],
    },
    {
      food: "🌿",
      left: "76%",
      delay: "-17s",
      duration: "14s",
      size: "21px",
      drift: ["20px", "-15px", "30px", "-25px"],
      opacity: 0.35,
      rotate: ["-10deg", "20deg", "40deg"],
    },
    {
      food: "🍅",
      left: "83%",
      delay: "-9s",
      duration: "11s",
      size: "22px",
      drift: ["-25px", "30px", "-15px", "20px"],
      opacity: 0.4,
      rotate: ["20deg", "-10deg", "35deg"],
    },
    {
      food: "🌶️",
      left: "91%",
      delay: "-15s",
      duration: "13s",
      size: "20px",
      drift: ["25px", "-20px", "30px", "-15px"],
      opacity: 0.35,
      rotate: ["-15deg", "15deg", "35deg"],
    },

    // Extra dishes
    {
      food: "🍛",
      left: "12%",
      delay: "-19s",
      duration: "16s",
      size: "25px",
      drift: ["20px", "-25px", "30px", "-20px"],
      opacity: 0.35,
      rotate: ["-15deg", "10deg", "30deg"],
    },
    {
      food: "🍜",
      left: "42%",
      delay: "-16s",
      duration: "15s",
      size: "26px",
      drift: ["-25px", "20px", "-30px", "15px"],
      opacity: 0.35,
      rotate: ["15deg", "-10deg", "35deg"],
    },
    {
      food: "🥘",
      left: "55%",
      delay: "-20s",
      duration: "17s",
      size: "25px",
      drift: ["30px", "-20px", "25px", "-30px"],
      opacity: 0.3,
      rotate: ["-10deg", "20deg", "40deg"],
    },
    {
      food: "🫓",
      left: "88%",
      delay: "-18s",
      duration: "16s",
      size: "24px",
      drift: ["-30px", "25px", "-20px", "15px"],
      opacity: 0.35,
      rotate: ["20deg", "-15deg", "30deg"],
    },
  ];

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#14231C] px-6 text-[#F2EDE4]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500&display=swap');

        .biteloop-serif {
          font-family: 'Fraunces', serif;
        }

        .biteloop-sans {
          font-family: 'Inter', sans-serif;
        }

        /* =====================================================
           AMBIENT BACKGROUND
        ===================================================== */

        @keyframes ambientMove {
          0%, 100% {
            transform: translate3d(-8%, -5%, 0) scale(1);
          }

          50% {
            transform: translate3d(8%, 6%, 0) scale(1.15);
          }
        }

        @keyframes ambientMoveReverse {
          0%, 100% {
            transform: translate3d(8%, 5%, 0) scale(1.05);
          }

          50% {
            transform: translate3d(-10%, -8%, 0) scale(0.95);
          }
        }

        .ambient-one {
          animation: ambientMove 12s ease-in-out infinite;
        }

        .ambient-two {
          animation: ambientMoveReverse 15s ease-in-out infinite;
        }

        /* =====================================================
           FULL PAGE FALLING FOOD
        ===================================================== */

        @keyframes foodFall {
          0% {
            transform:
              translate3d(0, -140px, 0)
              rotate(var(--rotate-start))
              scale(var(--food-scale));

            opacity: 0;
            filter: blur(1px);
          }

          8% {
            opacity: var(--food-opacity);
          }

          30% {
            transform:
              translate3d(var(--drift-1), 28vh, 0)
              rotate(var(--rotate-mid))
              scale(var(--food-scale));

            opacity: var(--food-opacity);
            filter: blur(0);
          }

          55% {
            transform:
              translate3d(var(--drift-2), 55vh, 0)
              rotate(var(--rotate-end))
              scale(calc(var(--food-scale) * 0.9));

            opacity: calc(var(--food-opacity) * 0.9);
          }

          72% {
            transform:
              translate3d(var(--drift-3), 73vh, 0)
              rotate(calc(var(--rotate-end) + 12deg))
              scale(calc(var(--food-scale) * 0.65));

            opacity: calc(var(--food-opacity) * 0.55);
            filter: blur(1px);
          }

          87% {
            transform:
              translate3d(var(--drift-4), 87vh, 0)
              rotate(calc(var(--rotate-end) + 25deg))
              scale(calc(var(--food-scale) * 0.3));

            opacity: 0.15;
            filter: blur(3px);
          }

          100% {
            transform:
              translate3d(var(--drift-4), 96vh, 0)
              rotate(calc(var(--rotate-end) + 35deg))
              scale(0.05);

            opacity: 0;
            filter: blur(6px);
          }
        }

        .food-rain {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 2;
        }

        .food-item {
          position: absolute;
          top: -80px;

          display: flex;
          align-items: center;
          justify-content: center;

          line-height: 1;

          animation-name: foodFall;
          animation-timing-function: cubic-bezier(
            0.45,
            0.05,
            0.55,
            0.95
          );

          animation-iteration-count: infinite;

          will-change:
            transform,
            opacity,
            filter;

          user-select: none;
        }

        .food-item::after {
          content: "";

          position: absolute;
          inset: 20%;

          border-radius: 50%;

          background: rgba(232, 163, 61, 0.12);

          filter: blur(12px);

          z-index: -1;
        }

        /* =====================================================
           FLOATING PARTICLES
        ===================================================== */

        @keyframes floatParticle {
          0% {
            transform:
              translate3d(0, 20px, 0)
              scale(0.5);

            opacity: 0;
          }

          20% {
            opacity: 0.5;
          }

          50% {
            transform:
              translate3d(15px, -25px, 0)
              scale(1);

            opacity: 0.8;
          }

          80% {
            opacity: 0.4;
          }

          100% {
            transform:
              translate3d(-12px, -70px, 0)
              scale(0.3);

            opacity: 0;
          }
        }

        .particle {
          animation:
            floatParticle linear infinite;
        }

        /* =====================================================
           CENTRAL GLOW
        ===================================================== */

        @keyframes centralGlow {
          0%, 100% {
            transform:
              translate(-50%, -50%)
              scale(0.85);

            opacity: 0.35;
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.2);

            opacity: 0.7;
          }
        }

        .central-glow {
          animation:
            centralGlow 4s ease-in-out infinite;
        }

        /* =====================================================
           RINGS
        ===================================================== */

        @keyframes ringPulse {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0.65);

            opacity: 0;
          }

          25% {
            opacity: 0.35;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(1.8);

            opacity: 0;
          }
        }

        .ring {
          animation:
            ringPulse 4s ease-out infinite;
        }

        .ring-delay-1 {
          animation-delay: 1.3s;
        }

        .ring-delay-2 {
          animation-delay: 2.6s;
        }

        /* =====================================================
           CENTRAL DISH ANIMATION
        ===================================================== */

        @keyframes fallVanish {
          0% {
            transform:
              translateY(-80px)
              rotate(var(--start-rot, -6deg))
              scale(0.7);

            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          45% {
            transform:
              translateY(0)
              rotate(0deg)
              scale(1);

            opacity: 1;
          }

          70% {
            transform:
              translateY(22px)
              rotate(var(--end-rot, 6deg))
              scale(0.65);

            opacity: 0.65;
          }

          100% {
            transform:
              translateY(48px)
              rotate(var(--end-rot, 6deg))
              scale(0.1);

            opacity: 0;
          }
        }

        .dish {
          animation-name: fallVanish;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        /* =====================================================
           LOGO REVEAL
        ===================================================== */

        @keyframes logoReveal {
          0% {
            opacity: 0;
            transform:
              translateY(25px)
              scale(0.96);

            filter: blur(8px);
          }

          60% {
            opacity: 1;
            filter: blur(0);
          }

          100% {
            opacity: 1;

            transform:
              translateY(0)
              scale(1);

            filter: blur(0);
          }
        }

        .logo-reveal {
          animation:
            logoReveal 1.2s
            cubic-bezier(.16, 1, .3, 1)
            both;
        }

        /* =====================================================
           LOGO SHIMMER
        ===================================================== */

        @keyframes textShimmer {
          0%, 65% {
            background-position: 200% center;
          }

          100% {
            background-position: -200% center;
          }
        }

        .logo-text {
          background:
            linear-gradient(
              110deg,
              #F2EDE4 35%,
              #E8A33D 50%,
              #F2EDE4 65%
            );

          background-size: 250% auto;

          background-clip: text;
          -webkit-background-clip: text;

          color: transparent;

          animation:
            textShimmer 5s ease-in-out infinite;
        }

        /* =====================================================
           FADE UP
        ===================================================== */

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-up {
          animation:
            fadeUp 0.9s ease-out both;
        }

        /* =====================================================
           LAUNCH BADGE
        ===================================================== */

        @keyframes badgeFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-4px);
          }
        }

        .badge {
          animation:
            fadeUp 0.9s ease-out 0.8s both,
            badgeFloat 3s ease-in-out 1.8s infinite;
        }

        @keyframes statusPulse {
          0%, 100% {
            box-shadow:
              0 0 0 0
              rgba(232, 163, 61, 0.35);

            opacity: 0.6;
          }

          50% {
            box-shadow:
              0 0 0 7px
              rgba(232, 163, 61, 0);

            opacity: 1;
          }
        }

        .status-dot {
          animation:
            statusPulse 2s ease-out infinite;
        }

        /* =====================================================
           ORBIT
        ===================================================== */

        @keyframes orbit {
          from {
            transform:
              rotate(0deg)
              translateX(105px)
              rotate(0deg);
          }

          to {
            transform:
              rotate(360deg)
              translateX(105px)
              rotate(-360deg);
          }
        }

        .orbit {
          animation:
            orbit 9s linear infinite;
        }

        /* =====================================================
           DECORATIVE LINES
        ===================================================== */

        @keyframes lineGrow {
          from {
            width: 0;
            opacity: 0;
          }

          to {
            width: 100%;
            opacity: 1;
          }
        }

        .line-grow {
          animation:
            lineGrow 1.4s ease-out 0.3s both;
        }

        /* =====================================================
           FLOATING BADGE
        ===================================================== */

        @keyframes slowFloat {
          0%, 100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        .slow-float {
          animation:
            slowFloat 5s ease-in-out infinite;
        }

        /* =====================================================
           ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }

          .food-item {
            animation: none !important;
            opacity: 0.2;
          }
        }
      `}</style>

      {/* =====================================================
          AMBIENT BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">
        <div
          className="ambient-one absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(232,163,61,0.10), transparent 65%)",
          }}
        />

        <div
          className="ambient-two absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(193,91,61,0.10), transparent 65%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(242,237,228,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,237,228,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* =====================================================
          FULL PAGE FOOD RAIN
      ===================================================== */}

      <div className="food-rain">
        {foodItems.map((item, index) => (
          <div
            key={index}
            className="food-item"
            style={
              {
                left: item.left,
                animationDelay: item.delay,
                animationDuration: item.duration,
                fontSize: item.size,

                "--food-scale":
                  Number.parseInt(item.size) >= 30
                    ? "1"
                    : "0.85",

                "--food-opacity": item.opacity,

                "--drift-1": item.drift[0],
                "--drift-2": item.drift[1],
                "--drift-3": item.drift[2],
                "--drift-4": item.drift[3],

                "--rotate-start": item.rotate[0],
                "--rotate-mid": item.rotate[1],
                "--rotate-end": item.rotate[2],
              } as React.CSSProperties
            }
          >
            {item.food}
          </div>
        ))}
      </div>

      {/* =====================================================
          FLOATING PARTICLES
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0 z-[3]">
        <span
          className="particle absolute left-[12%] top-[25%] h-1 w-1 rounded-full bg-[#E8A33D]"
          style={{
            animationDuration: "7s",
            animationDelay: "0s",
          }}
        />

        <span
          className="particle absolute left-[23%] top-[65%] h-1.5 w-1.5 rounded-full bg-[#F2EDE4]"
          style={{
            animationDuration: "9s",
            animationDelay: "1s",
          }}
        />

        <span
          className="particle absolute right-[15%] top-[30%] h-1 w-1 rounded-full bg-[#C15B3D]"
          style={{
            animationDuration: "8s",
            animationDelay: "2s",
          }}
        />

        <span
          className="particle absolute right-[25%] top-[70%] h-1.5 w-1.5 rounded-full bg-[#E8A33D]"
          style={{
            animationDuration: "10s",
            animationDelay: "3s",
          }}
        />

        <span
          className="particle absolute left-[40%] top-[15%] h-1 w-1 rounded-full bg-[#F2EDE4]"
          style={{
            animationDuration: "8s",
            animationDelay: "4s",
          }}
        />

        <span
          className="particle absolute right-[40%] top-[80%] h-1 w-1 rounded-full bg-[#C15B3D]"
          style={{
            animationDuration: "11s",
            animationDelay: "2s",
          }}
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="relative z-10 flex w-full max-w-xl flex-col items-center">

        {/* Top decorative line */}

        <div className="mb-10 flex w-full items-center gap-4 opacity-40">
          <div className="line-grow h-px flex-1 bg-gradient-to-r from-transparent to-[#E8A33D]" />

          <span className="text-[10px] tracking-[0.35em] text-[#B7BDB2]">
            BITELOOP
          </span>

          <div className="line-grow h-px flex-1 bg-gradient-to-l from-transparent to-[#E8A33D]" />
        </div>

        {/* =================================================
            CENTRAL HERO
        ================================================= */}

        <div className="relative mb-8 h-40 w-full max-w-sm">

          {/* Central glow */}

          <div
            className="central-glow absolute left-1/2 top-1/2 h-32 w-32 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(232,163,61,0.20), transparent 70%)",
            }}
          />

          {/* Expanding rings */}

          <div className="ring absolute left-1/2 top-1/2 h-24 w-24 rounded-full border border-[#E8A33D]/20" />

          <div className="ring ring-delay-1 absolute left-1/2 top-1/2 h-24 w-24 rounded-full border border-[#E8A33D]/20" />

          <div className="ring ring-delay-2 absolute left-1/2 top-1/2 h-24 w-24 rounded-full border border-[#E8A33D]/20" />

          {/* Orbiting dot */}

          <div className="absolute left-1/2 top-1/2">
            <div className="orbit h-2 w-2 rounded-full bg-[#E8A33D] shadow-[0_0_12px_rgba(232,163,61,0.7)]" />
          </div>

          {/* Bowl */}

          <div
            className="absolute left-1/2 top-0"
            style={{
              transform: "translateX(-82px)",
            }}
          >
            <div
              className="dish"
              style={{
                animationDuration: "3.6s",
                animationDelay: "0s",
                ["--start-rot" as string]: "-8deg",
                ["--end-rot" as string]: "10deg",
              }}
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 40 40"
              >
                <path
                  d="M6 17 a14 14 0 0 0 28 0 z"
                  fill="#E8A33D"
                />

                <ellipse
                  cx="20"
                  cy="17"
                  rx="14"
                  ry="2.5"
                  fill="#14231C"
                  opacity="0.25"
                />
              </svg>
            </div>
          </div>

          {/* Plate */}

          <div
            className="absolute left-1/2 top-0"
            style={{
              transform: "translateX(-19px)",
            }}
          >
            <div
              className="dish"
              style={{
                animationDuration: "3.6s",
                animationDelay: "1.2s",
                ["--start-rot" as string]: "5deg",
                ["--end-rot" as string]: "-8deg",
              }}
            >
              <svg
                width="38"
                height="38"
                viewBox="0 0 40 40"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="15"
                  fill="none"
                  stroke="#C15B3D"
                  strokeWidth="2.5"
                />

                <circle
                  cx="20"
                  cy="20"
                  r="5.5"
                  fill="#C15B3D"
                />
              </svg>
            </div>
          </div>

          {/* Cup */}

          <div
            className="absolute left-1/2 top-0"
            style={{
              transform: "translateX(45px)",
            }}
          >
            <div
              className="dish"
              style={{
                animationDuration: "3.6s",
                animationDelay: "2.4s",
                ["--start-rot" as string]: "-5deg",
                ["--end-rot" as string]: "9deg",
              }}
            >
              <svg
                width="32"
                height="36"
                viewBox="0 0 40 40"
              >
                <path
                  d="M12 8 h16 l-2 21 a2.5 2.5 0 0 1 -2.5 2.2 h-7 a2.5 2.5 0 0 1 -2.5 -2.2 z"
                  fill="#E8A33D"
                />

                <rect
                  x="10"
                  y="6"
                  width="20"
                  height="4"
                  rx="2"
                  fill="#F2EDE4"
                  opacity="0.55"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* =================================================
            LOGO
        ================================================= */}

        <h1
          className="logo-reveal logo-text biteloop-serif text-6xl font-medium tracking-tight sm:text-7xl"
          style={{
            animationDelay: "0.15s",
          }}
        >
          Biteloop
        </h1>

        {/* Accent */}

        <div
          className="fade-up mt-4 flex items-center gap-2"
          style={{
            animationDelay: "0.45s",
          }}
        >
          <span className="h-px w-8 bg-[#E8A33D]/50" />

          <span className="biteloop-sans text-[9px] uppercase tracking-[0.45em] text-[#7C8B7F]">
            Something good is cooking
          </span>

          <span className="h-px w-8 bg-[#E8A33D]/50" />
        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p
          className="fade-up biteloop-sans mt-6 max-w-md text-center text-base leading-relaxed text-[#B7BDB2] sm:text-lg"
          style={{
            animationDelay: "0.65s",
          }}
        >
          Home-style meals, made simple. We&apos;re in the kitchen building
          something worth the wait.
        </p>

        {/* =================================================
            LAUNCH STATUS
        ================================================= */}

        <div
          className="badge mt-10"
          style={{
            animationDelay: "0.8s",
          }}
        >
          <div className="slow-float flex items-center gap-3 rounded-full border border-[#E8A33D]/20 bg-[#1B2D24]/70 px-5 py-2.5 backdrop-blur-md">
            <span className="status-dot h-2 w-2 rounded-full bg-[#E8A33D]" />

            <span className="biteloop-sans text-sm tracking-wide text-[#B7BDB2]">
              Launching soon
            </span>

            <span className="text-[#E8A33D]">
              ✦
            </span>
          </div>
        </div>

        {/* =================================================
            BOTTOM MESSAGE
        ================================================= */}

        <p
          className="fade-up biteloop-sans mt-8 text-center text-[11px] uppercase tracking-[0.3em] text-[#59685E]"
          style={{
            animationDelay: "1.1s",
          }}
        >
          Stay hungry. Something is coming.
        </p>

        {/* Bottom line */}

        <div className="mt-10 flex w-full items-center gap-4 opacity-30">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#F2EDE4]" />

          <div className="h-1 w-1 rounded-full bg-[#E8A33D]" />

          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#F2EDE4]" />
        </div>
      </div>
    </main>
  );
}