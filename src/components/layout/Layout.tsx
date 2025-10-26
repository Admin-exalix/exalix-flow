import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { TopNav } from "./TopNav";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen pb-16 bg-background">
      <TopNav />
      <main className="max-w-screen-xl mx-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};
