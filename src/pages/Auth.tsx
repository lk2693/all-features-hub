import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Validation schemas
const loginSchema = z.object({
  email: z.string().trim().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein" }),
  password: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen haben" }),
});

const signupSchema = z.object({
  name: z.string().trim().min(2, { message: "Name muss mindestens 2 Zeichen haben" }).max(100),
  email: z.string().trim().email({ message: "Bitte gib eine gültige E-Mail-Adresse ein" }),
  password: z.string().min(6, { message: "Passwort muss mindestens 6 Zeichen haben" }),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Passwörter stimmen nicht überein",
  path: ["passwordConfirm"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  
  // Login form state
  const [loginData, setLoginData] = useState<LoginFormData>({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState<Partial<LoginFormData>>({});
  
  // Signup form state
  const [signupData, setSignupData] = useState<SignupFormData>({ 
    name: "", 
    email: "", 
    password: "", 
    passwordConfirm: "" 
  });
  const [signupErrors, setSignupErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});

  // Check if user is already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErrors({});

    const result = loginSchema.safeParse(loginData);
    if (!result.success) {
      const fieldErrors: Partial<LoginFormData> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as keyof LoginFormData;
        if (!fieldErrors[path]) {
          fieldErrors[path] = err.message;
        }
      });
      setLoginErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    });

    setIsLoading(false);

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast({
          title: "Anmeldung fehlgeschlagen",
          description: "E-Mail oder Passwort ist falsch.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Fehler",
          description: error.message,
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Willkommen zurück!",
      description: "Du bist jetzt angemeldet.",
    });
    navigate("/");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupErrors({});

    const result = signupSchema.safeParse(signupData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as keyof SignupFormData;
        if (!fieldErrors[path]) {
          fieldErrors[path] = err.message;
        }
      });
      setSignupErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email: signupData.email,
      password: signupData.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: signupData.name,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        toast({
          title: "E-Mail bereits registriert",
          description: "Diese E-Mail-Adresse ist bereits registriert. Bitte melde dich an.",
          variant: "destructive",
        });
        setActiveTab("login");
      } else {
        toast({
          title: "Fehler bei der Registrierung",
          description: error.message,
          variant: "destructive",
        });
      }
      return;
    }

    toast({
      title: "Registrierung erfolgreich!",
      description: "Du kannst dich jetzt anmelden.",
    });
    navigate("/");
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24 bg-gradient-section min-h-[80vh] flex items-center">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md mx-auto"
          >
            <Card className="border-border/50 shadow-card">
              <CardHeader className="text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero mx-auto mb-4">
                  <span className="font-display text-xl font-bold text-primary-foreground">K</span>
                </div>
                <CardTitle className="font-display text-2xl">Kulturrat Braunschweig</CardTitle>
                <CardDescription>
                  Melde dich an, um Ressourcen einzutragen und das Netzwerk zu nutzen.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Anmelden</TabsTrigger>
                    <TabsTrigger value="signup">Registrieren</TabsTrigger>
                  </TabsList>

                  {/* Login Tab */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">E-Mail</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-email"
                            type="email"
                            placeholder="deine@email.de"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            className={cn("pl-10", loginErrors.email && "border-destructive")}
                          />
                        </div>
                        {loginErrors.email && (
                          <p className="text-sm text-destructive">{loginErrors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="login-password">Passwort</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="login-password"
                            type="password"
                            placeholder="••••••••"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            className={cn("pl-10", loginErrors.password && "border-destructive")}
                          />
                        </div>
                        {loginErrors.password && (
                          <p className="text-sm text-destructive">{loginErrors.password}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-hero hover:opacity-90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Anmelden...
                          </>
                        ) : (
                          <>
                            Anmelden
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Signup Tab */}
                  <TabsContent value="signup">
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-name"
                            type="text"
                            placeholder="Dein Name"
                            value={signupData.name}
                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            className={cn("pl-10", signupErrors.name && "border-destructive")}
                          />
                        </div>
                        {signupErrors.name && (
                          <p className="text-sm text-destructive">{signupErrors.name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email">E-Mail</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="deine@email.de"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            className={cn("pl-10", signupErrors.email && "border-destructive")}
                          />
                        </div>
                        {signupErrors.email && (
                          <p className="text-sm text-destructive">{signupErrors.email}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Passwort</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            className={cn("pl-10", signupErrors.password && "border-destructive")}
                          />
                        </div>
                        {signupErrors.password && (
                          <p className="text-sm text-destructive">{signupErrors.password}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password-confirm">Passwort bestätigen</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="signup-password-confirm"
                            type="password"
                            placeholder="••••••••"
                            value={signupData.passwordConfirm}
                            onChange={(e) => setSignupData({ ...signupData, passwordConfirm: e.target.value })}
                            className={cn("pl-10", signupErrors.passwordConfirm && "border-destructive")}
                          />
                        </div>
                        {signupErrors.passwordConfirm && (
                          <p className="text-sm text-destructive">{signupErrors.passwordConfirm}</p>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-hero hover:opacity-90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Registrieren...
                          </>
                        ) : (
                          <>
                            Registrieren
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Mit der Anmeldung akzeptierst du unsere{" "}
                  <Link to="/datenschutz" className="text-primary hover:underline">
                    Datenschutzerklärung
                  </Link>
                  .
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
