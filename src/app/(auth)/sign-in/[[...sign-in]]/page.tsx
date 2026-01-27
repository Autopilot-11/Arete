import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="pillar-container p-8 mx-4">
        <h1 className="text-3xl font-bold text-center mb-6" style={{ fontFamily: "var(--font-playfair), serif" }}>
          Welcome to Aretē
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Sign in to continue your pursuit of excellence
        </p>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "btn-gold",
              card: "shadow-none",
            },
          }}
        />
      </div>
    </div>
  );
}
