// export default function Home() {
//   const foodItems = [
//     // Main food items
//     {
//       food: "🍛",
//       left: "3%",
//       delay: "-2s",
//       duration: "9s",
//       size: "34px",
//       drift: ["20px", "-30px", "35px", "-10px"],
//       opacity: 0.65,
//       rotate: ["-12deg", "8deg", "25deg"],
//     },
//     {
//       food: "🥟",
//       left: "9%",
//       delay: "-7s",
//       duration: "12s",
//       size: "27px",
//       drift: ["-25px", "30px", "-10px", "20px"],
//       opacity: 0.45,
//       rotate: ["15deg", "-12deg", "30deg"],
//     },
//     {
//       food: "🍲",
//       left: "16%",
//       delay: "-5s",
//       duration: "10s",
//       size: "32px",
//       drift: ["30px", "-15px", "25px", "-30px"],
//       opacity: 0.7,
//       rotate: ["-8deg", "15deg", "40deg"],
//     },
//     {
//       food: "🌮",
//       left: "23%",
//       delay: "-9s",
//       duration: "13s",
//       size: "29px",
//       drift: ["-20px", "25px", "-35px", "15px"],
//       opacity: 0.5,
//       rotate: ["20deg", "-10deg", "35deg"],
//     },
//     {
//       food: "🍚",
//       left: "30%",
//       delay: "-12s",
//       duration: "11s",
//       size: "31px",
//       drift: ["15px", "-25px", "30px", "-20px"],
//       opacity: 0.55,
//       rotate: ["-15deg", "12deg", "28deg"],
//     },
//     {
//       food: "🥗",
//       left: "37%",
//       delay: "-6s",
//       duration: "14s",
//       size: "28px",
//       drift: ["-30px", "20px", "-15px", "30px"],
//       opacity: 0.45,
//       rotate: ["10deg", "-20deg", "30deg"],
//     },
//     {
//       food: "🍜",
//       left: "44%",
//       delay: "-3s",
//       duration: "10s",
//       size: "33px",
//       drift: ["25px", "-20px", "35px", "-15px"],
//       opacity: 0.65,
//       rotate: ["-10deg", "18deg", "35deg"],
//     },
//     {
//       food: "🫓",
//       left: "51%",
//       delay: "-11s",
//       duration: "12s",
//       size: "30px",
//       drift: ["-15px", "30px", "-25px", "15px"],
//       opacity: 0.55,
//       rotate: ["18deg", "-15deg", "25deg"],
//     },
//     {
//       food: "🍱",
//       left: "58%",
//       delay: "-4s",
//       duration: "13s",
//       size: "34px",
//       drift: ["20px", "-30px", "20px", "-25px"],
//       opacity: 0.6,
//       rotate: ["-8deg", "15deg", "32deg"],
//     },
//     {
//       food: "🥘",
//       left: "65%",
//       delay: "-10s",
//       duration: "11s",
//       size: "31px",
//       drift: ["-25px", "20px", "-30px", "10px"],
//       opacity: 0.7,
//       rotate: ["15deg", "-10deg", "35deg"],
//     },
//     {
//       food: "🍳",
//       left: "72%",
//       delay: "-8s",
//       duration: "14s",
//       size: "30px",
//       drift: ["30px", "-20px", "25px", "-15px"],
//       opacity: 0.5,
//       rotate: ["-12deg", "20deg", "40deg"],
//     },
//     {
//       food: "🥙",
//       left: "79%",
//       delay: "-1s",
//       duration: "10s",
//       size: "29px",
//       drift: ["-20px", "25px", "-30px", "20px"],
//       opacity: 0.6,
//       rotate: ["10deg", "-18deg", "30deg"],
//     },
//     {
//       food: "🍲",
//       left: "86%",
//       delay: "-7s",
//       duration: "12s",
//       size: "33px",
//       drift: ["25px", "-30px", "15px", "-25px"],
//       opacity: 0.65,
//       rotate: ["-15deg", "12deg", "35deg"],
//     },
//     {
//       food: "🥟",
//       left: "94%",
//       delay: "-13s",
//       duration: "13s",
//       size: "26px",
//       drift: ["-30px", "15px", "-20px", "30px"],
//       opacity: 0.45,
//       rotate: ["20deg", "-10deg", "28deg"],
//     },

//     // Smaller background ingredients
//     {
//       food: "🌶️",
//       left: "6%",
//       delay: "-15s",
//       duration: "11s",
//       size: "21px",
//       drift: ["35px", "-20px", "25px", "-15px"],
//       opacity: 0.4,
//       rotate: ["-20deg", "10deg", "30deg"],
//     },
//     {
//       food: "🍋",
//       left: "14%",
//       delay: "-11s",
//       duration: "14s",
//       size: "20px",
//       drift: ["-25px", "20px", "-15px", "30px"],
//       opacity: 0.35,
//       rotate: ["15deg", "-20deg", "40deg"],
//     },
//     {
//       food: "🌿",
//       left: "20%",
//       delay: "-16s",
//       duration: "12s",
//       size: "22px",
//       drift: ["20px", "-30px", "20px", "-10px"],
//       opacity: 0.35,
//       rotate: ["-10deg", "25deg", "45deg"],
//     },
//     {
//       food: "🍅",
//       left: "27%",
//       delay: "-14s",
//       duration: "13s",
//       size: "22px",
//       drift: ["-20px", "30px", "-25px", "20px"],
//       opacity: 0.4,
//       rotate: ["20deg", "-15deg", "30deg"],
//     },
//     {
//       food: "🌶️",
//       left: "34%",
//       delay: "-18s",
//       duration: "15s",
//       size: "20px",
//       drift: ["30px", "-25px", "20px", "-20px"],
//       opacity: 0.35,
//       rotate: ["-15deg", "20deg", "35deg"],
//     },
//     {
//       food: "🍋",
//       left: "69%",
//       delay: "-12s",
//       duration: "12s",
//       size: "21px",
//       drift: ["-30px", "20px", "-25px", "15px"],
//       opacity: 0.4,
//       rotate: ["15deg", "-20deg", "30deg"],
//     },
//     {
//       food: "🌿",
//       left: "76%",
//       delay: "-17s",
//       duration: "14s",
//       size: "21px",
//       drift: ["20px", "-15px", "30px", "-25px"],
//       opacity: 0.35,
//       rotate: ["-10deg", "20deg", "40deg"],
//     },
//     {
//       food: "🍅",
//       left: "83%",
//       delay: "-9s",
//       duration: "11s",
//       size: "22px",
//       drift: ["-25px", "30px", "-15px", "20px"],
//       opacity: 0.4,
//       rotate: ["20deg", "-10deg", "35deg"],
//     },
//     {
//       food: "🌶️",
//       left: "91%",
//       delay: "-15s",
//       duration: "13s",
//       size: "20px",
//       drift: ["25px", "-20px", "30px", "-15px"],
//       opacity: 0.35,
//       rotate: ["-15deg", "15deg", "35deg"],
//     },

//     // Extra dishes
//     {
//       food: "🍛",
//       left: "12%",
//       delay: "-19s",
//       duration: "16s",
//       size: "25px",
//       drift: ["20px", "-25px", "30px", "-20px"],
//       opacity: 0.35,
//       rotate: ["-15deg", "10deg", "30deg"],
//     },
//     {
//       food: "🍜",
//       left: "42%",
//       delay: "-16s",
//       duration: "15s",
//       size: "26px",
//       drift: ["-25px", "20px", "-30px", "15px"],
//       opacity: 0.35,
//       rotate: ["15deg", "-10deg", "35deg"],
//     },
//     {
//       food: "🥘",
//       left: "55%",
//       delay: "-20s",
//       duration: "17s",
//       size: "25px",
//       drift: ["30px", "-20px", "25px", "-30px"],
//       opacity: 0.3,
//       rotate: ["-10deg", "20deg", "40deg"],
//     },
//     {
//       food: "🫓",
//       left: "88%",
//       delay: "-18s",
//       duration: "16s",
//       size: "24px",
//       drift: ["-30px", "25px", "-20px", "15px"],
//       opacity: 0.35,
//       rotate: ["20deg", "-15deg", "30deg"],
//     },
//   ];

//   return (
//     <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#14231C] px-6 text-[#F2EDE4]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500&display=swap');

//         .biteloop-serif {
//           font-family: 'Fraunces', serif;
//         }

//         .biteloop-sans {
//           font-family: 'Inter', sans-serif;
//         }

//         /* =====================================================
//            AMBIENT BACKGROUND
//         ===================================================== */

//         @keyframes ambientMove {
//           0%, 100% {
//             transform: translate3d(-8%, -5%, 0) scale(1);
//           }

//           50% {
//             transform: translate3d(8%, 6%, 0) scale(1.15);
//           }
//         }

//         @keyframes ambientMoveReverse {
//           0%, 100% {
//             transform: translate3d(8%, 5%, 0) scale(1.05);
//           }

//           50% {
//             transform: translate3d(-10%, -8%, 0) scale(0.95);
//           }
//         }

//         .ambient-one {
//           animation: ambientMove 12s ease-in-out infinite;
//         }

//         .ambient-two {
//           animation: ambientMoveReverse 15s ease-in-out infinite;
//         }

//         /* =====================================================
//            FULL PAGE FALLING FOOD
//         ===================================================== */

//         @keyframes foodFall {
//           0% {
//             transform:
//               translate3d(0, -140px, 0)
//               rotate(var(--rotate-start))
//               scale(var(--food-scale));

//             opacity: 0;
//             filter: blur(1px);
//           }

//           8% {
//             opacity: var(--food-opacity);
//           }

//           30% {
//             transform:
//               translate3d(var(--drift-1), 28vh, 0)
//               rotate(var(--rotate-mid))
//               scale(var(--food-scale));

//             opacity: var(--food-opacity);
//             filter: blur(0);
//           }

//           55% {
//             transform:
//               translate3d(var(--drift-2), 55vh, 0)
//               rotate(var(--rotate-end))
//               scale(calc(var(--food-scale) * 0.9));

//             opacity: calc(var(--food-opacity) * 0.9);
//           }

//           72% {
//             transform:
//               translate3d(var(--drift-3), 73vh, 0)
//               rotate(calc(var(--rotate-end) + 12deg))
//               scale(calc(var(--food-scale) * 0.65));

//             opacity: calc(var(--food-opacity) * 0.55);
//             filter: blur(1px);
//           }

//           87% {
//             transform:
//               translate3d(var(--drift-4), 87vh, 0)
//               rotate(calc(var(--rotate-end) + 25deg))
//               scale(calc(var(--food-scale) * 0.3));

//             opacity: 0.15;
//             filter: blur(3px);
//           }

//           100% {
//             transform:
//               translate3d(var(--drift-4), 96vh, 0)
//               rotate(calc(var(--rotate-end) + 35deg))
//               scale(0.05);

//             opacity: 0;
//             filter: blur(6px);
//           }
//         }

//         .food-rain {
//           position: absolute;
//           inset: 0;
//           width: 100%;
//           height: 100%;
//           overflow: hidden;
//           pointer-events: none;
//           z-index: 2;
//         }

//         .food-item {
//           position: absolute;
//           top: -80px;

//           display: flex;
//           align-items: center;
//           justify-content: center;

//           line-height: 1;

//           animation-name: foodFall;
//           animation-timing-function: cubic-bezier(
//             0.45,
//             0.05,
//             0.55,
//             0.95
//           );

//           animation-iteration-count: infinite;

//           will-change:
//             transform,
//             opacity,
//             filter;

//           user-select: none;
//         }

//         .food-item::after {
//           content: "";

//           position: absolute;
//           inset: 20%;

//           border-radius: 50%;

//           background: rgba(232, 163, 61, 0.12);

//           filter: blur(12px);

//           z-index: -1;
//         }

//         /* =====================================================
//            FLOATING PARTICLES
//         ===================================================== */

//         @keyframes floatParticle {
//           0% {
//             transform:
//               translate3d(0, 20px, 0)
//               scale(0.5);

//             opacity: 0;
//           }

//           20% {
//             opacity: 0.5;
//           }

//           50% {
//             transform:
//               translate3d(15px, -25px, 0)
//               scale(1);

//             opacity: 0.8;
//           }

//           80% {
//             opacity: 0.4;
//           }

//           100% {
//             transform:
//               translate3d(-12px, -70px, 0)
//               scale(0.3);

//             opacity: 0;
//           }
//         }

//         .particle {
//           animation:
//             floatParticle linear infinite;
//         }

//         /* =====================================================
//            CENTRAL GLOW
//         ===================================================== */

//         @keyframes centralGlow {
//           0%, 100% {
//             transform:
//               translate(-50%, -50%)
//               scale(0.85);

//             opacity: 0.35;
//           }

//           50% {
//             transform:
//               translate(-50%, -50%)
//               scale(1.2);

//             opacity: 0.7;
//           }
//         }

//         .central-glow {
//           animation:
//             centralGlow 4s ease-in-out infinite;
//         }

//         /* =====================================================
//            RINGS
//         ===================================================== */

//         @keyframes ringPulse {
//           0% {
//             transform:
//               translate(-50%, -50%)
//               scale(0.65);

//             opacity: 0;
//           }

//           25% {
//             opacity: 0.35;
//           }

//           100% {
//             transform:
//               translate(-50%, -50%)
//               scale(1.8);

//             opacity: 0;
//           }
//         }

//         .ring {
//           animation:
//             ringPulse 4s ease-out infinite;
//         }

//         .ring-delay-1 {
//           animation-delay: 1.3s;
//         }

//         .ring-delay-2 {
//           animation-delay: 2.6s;
//         }

//         /* =====================================================
//            CENTRAL DISH ANIMATION
//         ===================================================== */

//         @keyframes fallVanish {
//           0% {
//             transform:
//               translateY(-80px)
//               rotate(var(--start-rot, -6deg))
//               scale(0.7);

//             opacity: 0;
//           }

//           15% {
//             opacity: 1;
//           }

//           45% {
//             transform:
//               translateY(0)
//               rotate(0deg)
//               scale(1);

//             opacity: 1;
//           }

//           70% {
//             transform:
//               translateY(22px)
//               rotate(var(--end-rot, 6deg))
//               scale(0.65);

//             opacity: 0.65;
//           }

//           100% {
//             transform:
//               translateY(48px)
//               rotate(var(--end-rot, 6deg))
//               scale(0.1);

//             opacity: 0;
//           }
//         }

//         .dish {
//           animation-name: fallVanish;
//           animation-timing-function: ease-in-out;
//           animation-iteration-count: infinite;
//         }

//         /* =====================================================
//            LOGO REVEAL
//         ===================================================== */

//         @keyframes logoReveal {
//           0% {
//             opacity: 0;
//             transform:
//               translateY(25px)
//               scale(0.96);

//             filter: blur(8px);
//           }

//           60% {
//             opacity: 1;
//             filter: blur(0);
//           }

//           100% {
//             opacity: 1;

//             transform:
//               translateY(0)
//               scale(1);

//             filter: blur(0);
//           }
//         }

//         .logo-reveal {
//           animation:
//             logoReveal 1.2s
//             cubic-bezier(.16, 1, .3, 1)
//             both;
//         }

//         /* =====================================================
//            LOGO SHIMMER
//         ===================================================== */

//         @keyframes textShimmer {
//           0%, 65% {
//             background-position: 200% center;
//           }

//           100% {
//             background-position: -200% center;
//           }
//         }

//         .logo-text {
//           background:
//             linear-gradient(
//               110deg,
//               #F2EDE4 35%,
//               #E8A33D 50%,
//               #F2EDE4 65%
//             );

//           background-size: 250% auto;

//           background-clip: text;
//           -webkit-background-clip: text;

//           color: transparent;

//           animation:
//             textShimmer 5s ease-in-out infinite;
//         }

//         /* =====================================================
//            FADE UP
//         ===================================================== */

//         @keyframes fadeUp {
//           from {
//             opacity: 0;
//             transform: translateY(18px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .fade-up {
//           animation:
//             fadeUp 0.9s ease-out both;
//         }

//         /* =====================================================
//            LAUNCH BADGE
//         ===================================================== */

//         @keyframes badgeFloat {
//           0%, 100% {
//             transform: translateY(0);
//           }

//           50% {
//             transform: translateY(-4px);
//           }
//         }

//         .badge {
//           animation:
//             fadeUp 0.9s ease-out 0.8s both,
//             badgeFloat 3s ease-in-out 1.8s infinite;
//         }

//         @keyframes statusPulse {
//           0%, 100% {
//             box-shadow:
//               0 0 0 0
//               rgba(232, 163, 61, 0.35);

//             opacity: 0.6;
//           }

//           50% {
//             box-shadow:
//               0 0 0 7px
//               rgba(232, 163, 61, 0);

//             opacity: 1;
//           }
//         }

//         .status-dot {
//           animation:
//             statusPulse 2s ease-out infinite;
//         }

//         /* =====================================================
//            ORBIT
//         ===================================================== */

//         @keyframes orbit {
//           from {
//             transform:
//               rotate(0deg)
//               translateX(105px)
//               rotate(0deg);
//           }

//           to {
//             transform:
//               rotate(360deg)
//               translateX(105px)
//               rotate(-360deg);
//           }
//         }

//         .orbit {
//           animation:
//             orbit 9s linear infinite;
//         }

//         /* =====================================================
//            DECORATIVE LINES
//         ===================================================== */

//         @keyframes lineGrow {
//           from {
//             width: 0;
//             opacity: 0;
//           }

//           to {
//             width: 100%;
//             opacity: 1;
//           }
//         }

//         .line-grow {
//           animation:
//             lineGrow 1.4s ease-out 0.3s both;
//         }

//         /* =====================================================
//            FLOATING BADGE
//         ===================================================== */

//         @keyframes slowFloat {
//           0%, 100% {
//             transform: translateY(0);
//           }

//           50% {
//             transform: translateY(-8px);
//           }
//         }

//         .slow-float {
//           animation:
//             slowFloat 5s ease-in-out infinite;
//         }

//         /* =====================================================
//            ACCESSIBILITY
//         ===================================================== */

//         @media (prefers-reduced-motion: reduce) {
//           *,
//           *::before,
//           *::after {
//             animation-duration: 0.01ms !important;
//             animation-iteration-count: 1 !important;
//             scroll-behavior: auto !important;
//           }

//           .food-item {
//             animation: none !important;
//             opacity: 0.2;
//           }
//         }
//       `}</style>

//       {/* =====================================================
//           AMBIENT BACKGROUND
//       ===================================================== */}

//       <div className="pointer-events-none absolute inset-0">
//         <div
//           className="ambient-one absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full blur-3xl"
//           style={{
//             background:
//               "radial-gradient(circle, rgba(232,163,61,0.10), transparent 65%)",
//           }}
//         />

//         <div
//           className="ambient-two absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full blur-3xl"
//           style={{
//             background:
//               "radial-gradient(circle, rgba(193,91,61,0.10), transparent 65%)",
//           }}
//         />

//         <div
//           className="absolute inset-0 opacity-[0.035]"
//           style={{
//             backgroundImage:
//               "linear-gradient(rgba(242,237,228,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(242,237,228,0.5) 1px, transparent 1px)",
//             backgroundSize: "50px 50px",
//           }}
//         />
//       </div>

//       {/* =====================================================
//           FULL PAGE FOOD RAIN
//       ===================================================== */}

//       <div className="food-rain">
//         {foodItems.map((item, index) => (
//           <div
//             key={index}
//             className="food-item"
//             style={
//               {
//                 left: item.left,
//                 animationDelay: item.delay,
//                 animationDuration: item.duration,
//                 fontSize: item.size,

//                 "--food-scale":
//                   Number.parseInt(item.size) >= 30
//                     ? "1"
//                     : "0.85",

//                 "--food-opacity": item.opacity,

//                 "--drift-1": item.drift[0],
//                 "--drift-2": item.drift[1],
//                 "--drift-3": item.drift[2],
//                 "--drift-4": item.drift[3],

//                 "--rotate-start": item.rotate[0],
//                 "--rotate-mid": item.rotate[1],
//                 "--rotate-end": item.rotate[2],
//               } as React.CSSProperties
//             }
//           >
//             {item.food}
//           </div>
//         ))}
//       </div>

//       {/* =====================================================
//           FLOATING PARTICLES
//       ===================================================== */}

//       <div className="pointer-events-none absolute inset-0 z-[3]">
//         <span
//           className="particle absolute left-[12%] top-[25%] h-1 w-1 rounded-full bg-[#E8A33D]"
//           style={{
//             animationDuration: "7s",
//             animationDelay: "0s",
//           }}
//         />

//         <span
//           className="particle absolute left-[23%] top-[65%] h-1.5 w-1.5 rounded-full bg-[#F2EDE4]"
//           style={{
//             animationDuration: "9s",
//             animationDelay: "1s",
//           }}
//         />

//         <span
//           className="particle absolute right-[15%] top-[30%] h-1 w-1 rounded-full bg-[#C15B3D]"
//           style={{
//             animationDuration: "8s",
//             animationDelay: "2s",
//           }}
//         />

//         <span
//           className="particle absolute right-[25%] top-[70%] h-1.5 w-1.5 rounded-full bg-[#E8A33D]"
//           style={{
//             animationDuration: "10s",
//             animationDelay: "3s",
//           }}
//         />

//         <span
//           className="particle absolute left-[40%] top-[15%] h-1 w-1 rounded-full bg-[#F2EDE4]"
//           style={{
//             animationDuration: "8s",
//             animationDelay: "4s",
//           }}
//         />

//         <span
//           className="particle absolute right-[40%] top-[80%] h-1 w-1 rounded-full bg-[#C15B3D]"
//           style={{
//             animationDuration: "11s",
//             animationDelay: "2s",
//           }}
//         />
//       </div>

//       {/* =====================================================
//           MAIN CONTENT
//       ===================================================== */}

//       <div className="relative z-10 flex w-full max-w-xl flex-col items-center">

//         {/* Top decorative line */}

//         <div className="mb-10 flex w-full items-center gap-4 opacity-40">
//           <div className="line-grow h-px flex-1 bg-gradient-to-r from-transparent to-[#E8A33D]" />

//           <span className="text-[10px] tracking-[0.35em] text-[#B7BDB2]">
//             BITELOOP
//           </span>

//           <div className="line-grow h-px flex-1 bg-gradient-to-l from-transparent to-[#E8A33D]" />
//         </div>

//         {/* =================================================
//             CENTRAL HERO
//         ================================================= */}

//         <div className="relative mb-8 h-40 w-full max-w-sm">

//           {/* Central glow */}

//           <div
//             className="central-glow absolute left-1/2 top-1/2 h-32 w-32 rounded-full"
//             style={{
//               background:
//                 "radial-gradient(circle, rgba(232,163,61,0.20), transparent 70%)",
//             }}
//           />

//           {/* Expanding rings */}

//           <div className="ring absolute left-1/2 top-1/2 h-24 w-24 rounded-full border border-[#E8A33D]/20" />

//           <div className="ring ring-delay-1 absolute left-1/2 top-1/2 h-24 w-24 rounded-full border border-[#E8A33D]/20" />

//           <div className="ring ring-delay-2 absolute left-1/2 top-1/2 h-24 w-24 rounded-full border border-[#E8A33D]/20" />

//           {/* Orbiting dot */}

//           <div className="absolute left-1/2 top-1/2">
//             <div className="orbit h-2 w-2 rounded-full bg-[#E8A33D] shadow-[0_0_12px_rgba(232,163,61,0.7)]" />
//           </div>

//           {/* Bowl */}

//           <div
//             className="absolute left-1/2 top-0"
//             style={{
//               transform: "translateX(-82px)",
//             }}
//           >
//             <div
//               className="dish"
//               style={{
//                 animationDuration: "3.6s",
//                 animationDelay: "0s",
//                 ["--start-rot" as string]: "-8deg",
//                 ["--end-rot" as string]: "10deg",
//               }}
//             >
//               <svg
//                 width="38"
//                 height="38"
//                 viewBox="0 0 40 40"
//               >
//                 <path
//                   d="M6 17 a14 14 0 0 0 28 0 z"
//                   fill="#E8A33D"
//                 />

//                 <ellipse
//                   cx="20"
//                   cy="17"
//                   rx="14"
//                   ry="2.5"
//                   fill="#14231C"
//                   opacity="0.25"
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Plate */}

//           <div
//             className="absolute left-1/2 top-0"
//             style={{
//               transform: "translateX(-19px)",
//             }}
//           >
//             <div
//               className="dish"
//               style={{
//                 animationDuration: "3.6s",
//                 animationDelay: "1.2s",
//                 ["--start-rot" as string]: "5deg",
//                 ["--end-rot" as string]: "-8deg",
//               }}
//             >
//               <svg
//                 width="38"
//                 height="38"
//                 viewBox="0 0 40 40"
//               >
//                 <circle
//                   cx="20"
//                   cy="20"
//                   r="15"
//                   fill="none"
//                   stroke="#C15B3D"
//                   strokeWidth="2.5"
//                 />

//                 <circle
//                   cx="20"
//                   cy="20"
//                   r="5.5"
//                   fill="#C15B3D"
//                 />
//               </svg>
//             </div>
//           </div>

//           {/* Cup */}

//           <div
//             className="absolute left-1/2 top-0"
//             style={{
//               transform: "translateX(45px)",
//             }}
//           >
//             <div
//               className="dish"
//               style={{
//                 animationDuration: "3.6s",
//                 animationDelay: "2.4s",
//                 ["--start-rot" as string]: "-5deg",
//                 ["--end-rot" as string]: "9deg",
//               }}
//             >
//               <svg
//                 width="32"
//                 height="36"
//                 viewBox="0 0 40 40"
//               >
//                 <path
//                   d="M12 8 h16 l-2 21 a2.5 2.5 0 0 1 -2.5 2.2 h-7 a2.5 2.5 0 0 1 -2.5 -2.2 z"
//                   fill="#E8A33D"
//                 />

//                 <rect
//                   x="10"
//                   y="6"
//                   width="20"
//                   height="4"
//                   rx="2"
//                   fill="#F2EDE4"
//                   opacity="0.55"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>

//         {/* =================================================
//             LOGO
//         ================================================= */}

//         <h1
//           className="logo-reveal logo-text biteloop-serif text-6xl font-medium tracking-tight sm:text-7xl"
//           style={{
//             animationDelay: "0.15s",
//           }}
//         >
//           Biteloop
//         </h1>

//         {/* Accent */}

//         <div
//           className="fade-up mt-4 flex items-center gap-2"
//           style={{
//             animationDelay: "0.45s",
//           }}
//         >
//           <span className="h-px w-8 bg-[#E8A33D]/50" />

//           <span className="biteloop-sans text-[9px] uppercase tracking-[0.45em] text-[#7C8B7F]">
//             Something good is cooking
//           </span>

//           <span className="h-px w-8 bg-[#E8A33D]/50" />
//         </div>

//         {/* =================================================
//             DESCRIPTION
//         ================================================= */}

//         <p
//           className="fade-up biteloop-sans mt-6 max-w-md text-center text-base leading-relaxed text-[#B7BDB2] sm:text-lg"
//           style={{
//             animationDelay: "0.65s",
//           }}
//         >
//           Home-style meals, made simple. We&apos;re in the kitchen building
//           something worth the wait.
//         </p>

//         {/* =================================================
//             LAUNCH STATUS
//         ================================================= */}

//         <div
//           className="badge mt-10"
//           style={{
//             animationDelay: "0.8s",
//           }}
//         >
//           <div className="slow-float flex items-center gap-3 rounded-full border border-[#E8A33D]/20 bg-[#1B2D24]/70 px-5 py-2.5 backdrop-blur-md">
//             <span className="status-dot h-2 w-2 rounded-full bg-[#E8A33D]" />

//             <span className="biteloop-sans text-sm tracking-wide text-[#B7BDB2]">
//               Launching soon
//             </span>

//             <span className="text-[#E8A33D]">
//               ✦
//             </span>
//           </div>
//         </div>

//         {/* =================================================
//             BOTTOM MESSAGE
//         ================================================= */}

//         <p
//           className="fade-up biteloop-sans mt-8 text-center text-[11px] uppercase tracking-[0.3em] text-[#59685E]"
//           style={{
//             animationDelay: "1.1s",
//           }}
//         >
//           Stay hungry. Something is coming.
//         </p>

//         {/* Bottom line */}

//         <div className="mt-10 flex w-full items-center gap-4 opacity-30">
//           <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#F2EDE4]" />

//           <div className="h-1 w-1 rounded-full bg-[#E8A33D]" />

//           <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#F2EDE4]" />
//         </div>
//       </div>
//     </main>
//   );
// }

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

    // Safety net: content must never stay invisible just because a JS
    // API didn't cooperate on a given browser. If the observer hasn't
    // fired within 1.2s, force it visible regardless of scroll position.
    const fallback = setTimeout(() => setInView(true), 1200);

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return () => clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return { ref, inView };
}

function Reveal({ children }: { children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
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
    <div className="absolute -bottom-6 -left-4 sm:-left-8 max-w-[250px] bg-white/95 backdrop-blur border border-[#2B2013]/10 rounded-2xl shadow-lg shadow-[#2B2013]/10 px-4 py-3 flex items-start gap-2.5 z-10">
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
    setTilt({ x: py * -8, y: px * 10 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (touch.clientX - rect.left) / rect.width - 0.5;
    const py = (touch.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -8, y: px * 10 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="relative w-full max-w-xl">
      {/* Warm glow behind the scene */}
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
            {/* Stove base */}
            <rect x="150" y="330" width="180" height="34" rx="8" fill="#2B2013" />
            <rect x="130" y="360" width="220" height="16" rx="6" fill="#241C15" />

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

            {/* Kadai (pot) */}
            <ellipse cx="240" cy="240" rx="115" ry="30" fill="#8B949A" />
            <path
              d="M125 240 Q125 300 240 305 Q355 300 355 240 Z"
              fill="#9BA3A8"
            />
            <ellipse cx="240" cy="238" rx="100" ry="24" fill="#D89B2C" />
            <ellipse cx="240" cy="234" rx="88" ry="18" fill="#E4AE49" />
            {/* Handles */}
            <rect x="95" y="222" width="34" height="12" rx="6" fill="#6B7377" />
            <rect x="351" y="222" width="34" height="12" rx="6" fill="#6B7377" />

            {/* Wooden spoon in the pot */}
            <path
              d="M290 230 L330 130"
              stroke="#8B5E34"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <ellipse cx="333" cy="120" rx="12" ry="16" fill="#8B5E34" />

            {/* Steam — bigger, multiple swirls */}
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

            {/* Tiffin box waiting beside the stove */}
            <g transform="translate(390, 250)">
              <rect x="0" y="0" width="120" height="48" rx="10" fill="#B23A2E" />
              <rect x="0" y="0" width="120" height="10" rx="5" fill="#2B2013" />
              <rect x="0" y="52" width="120" height="48" rx="10" fill="#D89B2C" />
              <rect x="0" y="52" width="120" height="10" rx="5" fill="#2B2013" />
              <path
                d="M25 -10 Q60 -35 95 -10"
                stroke="#2B2013"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
            </g>

            {/* Spice dots scattered */}
            <circle cx="70" cy="150" r="6" fill="#B23A2E" opacity="0.6" />
            <circle cx="460" cy="140" r="8" fill="#55713C" opacity="0.6" />
            <circle cx="50" cy="280" r="5" fill="#D89B2C" opacity="0.6" />
          </svg>
        </div>
      </div>

      <LiveActivityCard />
    </div>
  );
}

export default function HomePage() {
  return (
    <div className={`${workSans.className} bg-[#FBF4EC] text-[#2B2013] min-h-screen overflow-x-hidden`}>
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
          0%, 100% { transform: rotateX(3deg) rotateY(-5deg); }
          50% { transform: rotateX(-2deg) rotateY(5deg); }
        }

        @keyframes sceneBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes steamRise {
          0% { opacity: 0.15; transform: translateY(6px) scaleY(0.85); }
          50% { opacity: 0.75; transform: translateY(-6px) scaleY(1.1); }
          100% { opacity: 0.15; transform: translateY(6px) scaleY(0.85); }
        }

        @keyframes flameFlicker {
          0%, 100% { transform: scaleY(1) scaleX(1); }
          50% { transform: scaleY(1.08) scaleX(0.95); }
        }

        @keyframes livePing {
          75%, 100% { transform: scale(1.8); opacity: 0; }
        }

        @keyframes heroEnter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className={`${fraunces.className} text-xl font-semibold`}>
          Biteloop
        </span>

        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#how-it-works" className="hover:text-[#B23A2E] transition-colors">
            How it works
          </a>
          <a href="#for-businesses" className="hover:text-[#B23A2E] transition-colors">
            For businesses
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm hidden sm:inline hover:text-[#B23A2E] transition-colors">
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-[#B23A2E] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#963025] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#B23A2E]/25 transition-all"
          >
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1
            className={`${fraunces.className} hero-enter text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.05] font-semibold mb-6`}
          >
            Home-cooked food from the kitchen next door.
          </h1>
          <p
            className="hero-enter text-lg text-[#2B2013]/80 max-w-md mb-8 leading-relaxed"
            style={{ animationDelay: "120ms" }}
          >
            Biteloop connects you with local tiffin services and home kitchens
            near you — real meals, made fresh, ordered in minutes.
          </p>
          <div className="hero-enter flex flex-wrap gap-4" style={{ animationDelay: "240ms" }}>
            <Link
              href="/providers"
              className="bg-[#B23A2E] text-white font-medium px-6 py-3 rounded-full hover:bg-[#963025] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#B23A2E]/25 transition-all"
            >
              Browse kitchens near you
            </Link>
            <Link
              href="/register"
              className="border border-[#2B2013]/20 font-medium px-6 py-3 rounded-full hover:border-[#2B2013]/40 hover:-translate-y-0.5 transition-all"
            >
              List your kitchen
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end hero-enter" style={{ animationDelay: "180ms" }}>
          <CookingIllustration />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-[#F4E9D8] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className={`${fraunces.className} text-3xl font-semibold mb-12`}>
              How it works
            </h2>

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
              ].map((step) => (
                <div key={step.num}>
                  <span
                    className={`${fraunces.className} text-4xl font-semibold text-[#D89B2C] block mb-3`}
                  >
                    {step.num}
                  </span>
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-[#2B2013]/75 leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Biteloop */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <h2 className={`${fraunces.className} text-3xl font-semibold mb-12`}>
              Why Biteloop
            </h2>

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
                <div key={item.title} className={`py-6 md:py-0 ${i > 0 ? "md:pl-10" : ""} ${i < 2 ? "md:pr-10" : ""}`}>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-[#2B2013]/75 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* For businesses */}
      <section id="for-businesses" className="bg-[#2B2013] text-[#FBF4EC] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div>
                <h2 className={`${fraunces.className} text-3xl font-semibold mb-3`}>
                  Run a mess or tiffin service?
                </h2>
                <p className="text-[#FBF4EC]/75 max-w-md leading-relaxed">
                  List your kitchen on Biteloop and reach customers nearby who
                  are looking for home-style food.
                </p>
              </div>
              <Link
                href="/register"
                className="bg-[#D89B2C] text-[#2B2013] font-medium px-6 py-3 rounded-full hover:bg-[#c78d26] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#D89B2C]/25 transition-all whitespace-nowrap self-start md:self-auto"
              >
                List your kitchen
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#2B2013]/60">
        <span className={`${fraunces.className} text-base font-semibold text-[#2B2013]`}>
          Biteloop
        </span>
        <span>© 2026 Biteloop</span>
      </footer>
    </div>
  );
}