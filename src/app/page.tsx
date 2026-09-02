export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#14231C] px-6 text-[#F2EDE4]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500&display=swap');

        .biteloop-serif { font-family: 'Fraunces', serif; }
        .biteloop-sans { font-family: 'Inter', sans-serif; }

        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes riseIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }

        .orbit-track { animation: orbit 6s linear infinite; }
        .pulse { animation: pulseDot 2.2s ease-in-out infinite; }
        .rise-in { animation: riseIn 0.7s ease-out both; }

        @media (prefers-reduced-motion: reduce) {
          .orbit-track, .pulse { animation: none; }
          .rise-in { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      {/* Loop mark — the one deliberate motion moment, echoing the brand name */}
      <div className="relative mb-10 h-20 w-20">
        <div className="absolute inset-0 rounded-full border border-[#3A4A3F]" />
        <div className="orbit-track absolute inset-0">
          <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E8A33D]" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="pulse h-2 w-2 rounded-full bg-[#C15B3D]" />
        </div>
      </div>

      <h1
        className="rise-in biteloop-serif text-5xl font-medium tracking-tight sm:text-6xl"
        style={{ animationDelay: "0.1s" }}
      >
        Biteloop
      </h1>

      <p
        className="rise-in biteloop-sans mt-4 max-w-sm text-center text-base leading-relaxed text-[#B7BDB2]"
        style={{ animationDelay: "0.25s" }}
      >
        Home-style meals, made simple. We&apos;re in the kitchen building something worth the wait.
      </p>

      <div
        className="rise-in biteloop-sans mt-10 flex items-center gap-2 text-sm text-[#7C8B7F]"
        style={{ animationDelay: "0.4s" }}
      >
        <span className="pulse h-1.5 w-1.5 rounded-full bg-[#E8A33D]" />
        Launching soon
      </div>
    </main>
  );
}