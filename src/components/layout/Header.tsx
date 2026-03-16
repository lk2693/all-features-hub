import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, User, LogOut, Shield, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "@/components/GlobalSearch";

const navigation = [
  { name: "Über uns", href: "/ueber-uns" },
  { name: "News", href: "/news" },
  { name: "Kalender", href: "/kalender" },
  { name: "Ressourcen", href: "/ressourcen" },
  { name: "Förderung", href: "/foerderung" },
  { name: "Kontakt", href: "/kontakt" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut, isLoading } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { scrollY } = useScroll();

  const isHome = location.pathname === "/";

  // Hide header on scroll down, show on scroll up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 50);
    if (latest > prev && latest > 200) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden && !mobileMenuOpen ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || !isHome
            ? "bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-gradient-to-b from-foreground/40 to-transparent backdrop-blur-[2px]"
        )}
      >
        <nav className="container flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-hero shadow-glow"
            >
              <span className="font-display text-lg font-bold text-primary-foreground">K</span>
            </motion.div>
            <div className="hidden sm:block">
              <p className={cn(
                "font-display text-lg font-bold transition-colors",
                scrolled || !isHome ? "text-foreground" : "text-primary-foreground"
              )}>
                Kulturrat
              </p>
              <p className={cn(
                "text-[10px] uppercase tracking-[0.2em] font-medium transition-colors",
                scrolled || !isHome ? "text-muted-foreground" : "text-primary-foreground/60"
              )}>
                Braunschweig
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-0.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                    isActive
                      ? scrolled || !isHome ? "text-primary" : "text-primary-foreground"
                      : scrolled || !isHome
                        ? "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  )}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                "ml-2 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm transition-all",
                scrolled || !isHome
                  ? "border-border/50 text-muted-foreground hover:border-border hover:text-foreground"
                  : "border-primary-foreground/20 text-primary-foreground/60 hover:border-primary-foreground/40 hover:text-primary-foreground"
              )}
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs hidden xl:inline">Suche</span>
              <kbd className={cn(
                "hidden xl:inline text-[10px] px-1.5 py-0.5 rounded font-mono",
                scrolled || !isHome ? "bg-muted" : "bg-primary-foreground/10"
              )}>⌘K</kbd>
            </button>
          </div>

          {/* CTA & Auth */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {!isLoading && (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "gap-2 rounded-full",
                          scrolled || !isHome ? "" : "text-primary-foreground hover:bg-primary-foreground/10"
                        )}
                      >
                        <div className="w-7 h-7 rounded-full bg-gradient-hero flex items-center justify-center">
                          <User className="h-3.5 w-3.5 text-primary-foreground" />
                        </div>
                        <span className="max-w-[100px] truncate text-sm">
                          {user.user_metadata?.display_name || user.email?.split("@")[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/mitgliederbereich" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          Mitgliederbereich
                        </Link>
                      </DropdownMenuItem>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className={cn(
                        scrolled || !isHome ? "" : "text-primary-foreground hover:bg-primary-foreground/10"
                      )}
                    >
                      <Link to="/auth">Anmelden</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-hero hover:opacity-90 group rounded-full px-5"
                      asChild
                    >
                      <Link to="/mitmachen">
                        Mitmachen
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile buttons */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => setSearchOpen(true)}
              className={cn(
                "p-2.5 rounded-lg transition-colors",
                scrolled || !isHome
                  ? "text-muted-foreground hover:bg-muted"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10"
              )}
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2.5 rounded-lg transition-colors",
                scrolled || !isHome
                  ? "text-foreground hover:bg-muted"
                  : "text-primary-foreground hover:bg-primary-foreground/10"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Fullscreen Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col h-full pt-24 pb-8 px-6">
              <nav className="flex-1 space-y-1">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                  >
                    <Link
                      to={item.href}
                      className={cn(
                        "flex items-center justify-between py-4 text-2xl font-display font-bold transition-colors border-b border-border/30",
                        location.pathname === item.href
                          ? "text-primary"
                          : "text-foreground hover:text-primary"
                      )}
                    >
                      {item.name}
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-3 pt-6"
              >
                {!isLoading && (
                  <>
                    {user ? (
                      <>
                        <p className="text-sm text-muted-foreground mb-3">
                          {user.email}
                        </p>
                        {isAdmin && (
                          <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                            <Link to="/admin">
                              <Shield className="mr-2 h-4 w-4" />
                              Admin Dashboard
                            </Link>
                          </Button>
                        )}
                        <Button variant="outline" className="w-full justify-start" size="lg" asChild>
                          <Link to="/mitgliederbereich">
                            <User className="mr-2 h-4 w-4" />
                            Mitgliederbereich
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-destructive"
                          size="lg"
                          onClick={handleSignOut}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Abmelden
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className="w-full" size="lg" asChild>
                          <Link to="/auth">Anmelden</Link>
                        </Button>
                        <Button className="w-full bg-gradient-hero hover:opacity-90" size="lg" asChild>
                          <Link to="/mitmachen">
                            Mitglied werden
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
