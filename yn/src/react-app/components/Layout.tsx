import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Load Nunito font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    
    // Apply font to body
    document.body.style.fontFamily = "'Nunito', system-ui, sans-serif";
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-60 h-60 bg-accent/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
      </div>
      
      {/* Header */}
      <header className="relative z-10 px-4 py-6 sm:py-8">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-xl sm:text-2xl">💚</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">MindCare+</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">Your safe space to reflect</p>
          </div>
        </div>
      </header>

      {/* Desktop navigation */}
      <div className="hidden sm:block relative z-10">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="relative z-10 px-4 pb-24 sm:pb-8">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile navigation */}
      <div className="sm:hidden">
        <Navbar />
      </div>
    </div>
  );
}
