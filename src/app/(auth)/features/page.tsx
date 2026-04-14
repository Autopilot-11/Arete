import Link from "next/link";

const features = [
  {
    title: "Focus Timer",
    description: "Deep work tracking with a beautiful timer. Start focused sessions and watch your productivity grow as you align your time with your priorities.",
    icon: "⏱️",
  },
  {
    title: "Daily Efficiency Graph",
    description: "Visualize your daily productivity with intuitive charts. See how your focused hours stack up and identify your most productive times.",
    icon: "📊",
  },
  {
    title: "Complete Time Log",
    description: "A comprehensive record of all your logged activities. Review your past sessions, track patterns, and understand where your time goes.",
    icon: "📋",
  },
  {
    title: "AI Oracle",
    description: "Receive personalized Stoic wisdom based on your productivity. The AI adapts its tone to challenge or encourage you based on your recent progress.",
    icon: "🏛️",
  },
  {
    title: "History Analysis",
    description: "Dive deep into your productivity history. Analyze trends across days, weeks, and months to understand your long-term growth.",
    icon: "📈",
  },
  {
    title: "More Coming Soon",
    description: "We're constantly building new features to help you pursue excellence. Stay tuned for goal setting, habit tracking, and community features.",
    icon: "✨",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-[#FDF8F3]/95 backdrop-blur border-b border-[#D4A574]/20">
        <Link href="/">
          <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair), serif", color: "#D4A574" }}>
            Aretē
          </h1>
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/features" className="text-gray-700 hover:text-gray-900 font-medium">
            Features
          </Link>
          <Link href="/sign-in" className="text-gray-700 hover:text-gray-900">
            Sign In
          </Link>
          <Link href="/sign-up" className="btn-gold">
            Get Started
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h2
              className="text-5xl md:text-6xl font-bold mb-4"
              style={{ fontFamily: "var(--font-playfair), serif" }}
            >
              Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to pursue your highest potential
            </p>
          </div>

          {/* Feature Cards - 2 rows of 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {features.slice(0, 3).map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3
                  className="text-xl font-bold mb-2 text-gray-800"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.slice(3, 6).map((feature, index) => (
              <div
                key={index + 3}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3
                  className="text-xl font-bold mb-2 text-gray-800"
                  style={{ fontFamily: "var(--font-playfair), serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 text-sm">
        <p>&quot;We are what we repeatedly do. Excellence, then, is not an act, but a habit.&quot;</p>
        <p className="mt-1">— Aristotle</p>
      </footer>
    </div>
  );
}
