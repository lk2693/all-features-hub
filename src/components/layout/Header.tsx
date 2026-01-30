import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Über uns", href: "/ueber-uns" },
  { name: "News", href: "/news" },
  { name: "Kalender", href: "/kalender" },
  { name: "Ressourcen", href: "/ressourcen" },
  { name: "Förderung", href: "/foerderung" },
  { name: "Mitmachen", href: "/mitmachen" },
  { name: "Kontakt", href: "/kontakt" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="container flex h-16 items-center justify-between lg:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero">
            <span className="font-display text-lg font-bold text-primary-foreground">K</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-lg font-semibold text-foreground">Kulturrat</p>
            <p className="text-xs text-muted-foreground">Braunschweig</p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-muted",
                location.pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* CTA Buttons & Auth */}
        <div className="hidden lg:flex lg:items-center lg:gap-3">
          {!isLoading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <User className="h-4 w-4" />
                      <span className="max-w-[120px] truncate">
                        {user.user_metadata?.display_name || user.email?.split("@")[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/ressourcen/eintragen" className="cursor-pointer">
                        Ressource eintragen
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Abmelden
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/auth">Anmelden</Link>
                  </Button>
                  <Button size="sm" className="bg-gradient-hero hover:opacity-90" asChild>
                    <Link to="/mitmachen">Mitglied werden</Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Menü öffnen</span>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <div className="container py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-base font-medium rounded-lg transition-colors",
                    location.pathname === item.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2 border-t border-border">
                {!isLoading && (
                  <>
                    {user ? (
                      <>
                        <div className="px-4 py-2 text-sm text-muted-foreground">
                          Angemeldet als: {user.email}
                        </div>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/ressourcen/eintragen" onClick={() => setMobileMenuOpen(false)}>
                            Ressource eintragen
                          </Link>
                        </Button>
                        <Button 
                          variant="destructive" 
                          className="w-full" 
                          onClick={() => {
                            handleSignOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Abmelden
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="w-full" asChild>
                          <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                            Anmelden
                          </Link>
                        </Button>
                        <Button className="w-full bg-gradient-hero hover:opacity-90" asChild>
                          <Link to="/mitmachen" onClick={() => setMobileMenuOpen(false)}>
                            Mitglied werden
                          </Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
