export default function Home() {
  return (
    <main className="flex-grow flex items-center justify-center">
      <div className="text-center space-y-4 px-6">
        {/* Logo mark */}
        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-green-500/30">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
            aria-hidden="true"
          >
            <circle cx="12" cy="7" r="3" />
            <path d="M12 10 L12 18" />
            <path d="M8 13 L12 11 L16 13" />
            <path d="M12 13 L12 15" strokeWidth="1.5" />
            <path d="M11 14 L13 14" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Wordmark */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
          MedLink
        </h1>

        <p className="text-slate-500 text-lg max-w-sm mx-auto leading-relaxed">
          Migration in progress — full UI coming in Phase 5.
        </p>
      </div>
    </main>
  );
}
