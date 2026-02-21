import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    // Get user from window data (injected by Blade)
    if ((window as any).APP_DATA?.user) {
      setUser((window as any).APP_DATA.user);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { label: "Fonctionnalités", href: "#features" },
    { label: "Comment ça marche", href: "#how-it-works" },
    { label: "C'est pour qui", href: "#who-its-for" },
    { label: "Tarifs", href: "#packages" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-surface/95 backdrop-blur-md shadow-card border-b border-border"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-accent flex items-center justify-center">
            <span className="font-display font-bold text-primary-foreground text-sm">LS</span>
          </div>
          <span className={`font-display font-bold text-lg ${scrolled ? "text-foreground" : "text-primary-foreground"}`}>
            LearningSkills
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${scrolled ? "text-muted-foreground" : "text-primary-foreground/70"
                }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <a href="/dashboard">
              <Button size="sm" className="bg-gradient-accent text-primary font-bold hover:opacity-90 transition-opacity">
                Mon Tableau de Bord
              </Button>
            </a>
          ) : (
            <>
              <a href="/login">
                <Button variant="ghost" size="sm" className={scrolled ? "text-foreground" : "text-primary-foreground hover:bg-primary-foreground/10"}>
                  Connexion
                </Button>
              </a>
              <a href="/register">
                <Button size="sm" className="bg-gradient-accent text-primary font-bold hover:opacity-90 transition-opacity">
                  S'inscrire
                </Button>
              </a>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden p-2 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-surface border-t border-border px-4 py-6 space-y-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-4 border-t border-border">
            {user ? (
              <a href="/dashboard" className="w-full">
                <Button className="w-full bg-gradient-accent text-accent-foreground font-semibold">Tableau de Bord</Button>
              </a>
            ) : (
              <>
                <a href="/login" className="w-full">
                  <Button variant="outline" size="sm" className="w-full">Connexion</Button>
                </a>
                <a href="/register" className="w-full">
                  <Button size="sm" className="w-full bg-gradient-accent text-accent-foreground font-semibold">
                    S'inscrire
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
