import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-[#FDF8F3]/95 backdrop-blur border-b border-[#D4A574]/20">
        <h1 className="text-3xl font-bold" style={{ fontFamily: "var(--font-playfair), serif", color: "#D4A574" }}>
          Aretē
        </h1>
        <div className="flex items-center space-x-4">
          <Link href="/features" className="text-gray-700 hover:text-gray-900">
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

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl text-center">
          <h2
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: "var(--font-playfair), serif" }}
          >
            Pursue Your <span style={{ color: "#D4A574" }}>Highest Potential</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Aretē guides you to define what matters most, track your progress,
            and receive Stoic wisdom to keep you on your path to excellence.
          </p>

          <div className="pillar-container p-8 mb-8 mx-auto max-w-xl">
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "var(--font-playfair), serif" }}>
              The Three Pillars
            </h3>
            <p className="text-gray-600">
              Discover your top 3 life priorities through our Socratic onboarding process,
              then align your daily actions with what truly matters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up" className="btn-gold text-lg px-8 py-3">
              Start Your Journey
            </Link>
            <Link
              href="/sign-in"
              className="px-8 py-3 border-2 border-gray-300 rounded-md hover:border-gray-400 transition"
            >
              Already have an account?
            </Link>
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
