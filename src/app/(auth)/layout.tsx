import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "@/contexts/SidebarContext";
import BreathingBackground from "@/components/ui/BreathingBackground";

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SidebarProvider>
        <BreathingBackground />
        <div className="relative z-10">{children}</div>
      </SidebarProvider>
    </ClerkProvider>
  );
}
