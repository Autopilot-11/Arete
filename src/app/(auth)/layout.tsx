import { ClerkProvider } from "@clerk/nextjs";
import { SidebarProvider } from "@/contexts/SidebarContext";

export const dynamic = "force-dynamic";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </ClerkProvider>
  );
}
