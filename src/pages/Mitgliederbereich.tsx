import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User, Package, Users, Building, Loader2, Save, Check, Inbox,
  Calendar, ArrowRight, Shield, Clock, Sparkles
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import heroImage from "@/assets/mitgliederbereich-hero.jpg";
import { MyRequests } from "@/components/resources/MyRequests";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  organization: string | null;
  created_at: string;
}

interface Resource {
  id: string;
  title: string;
  category: string;
  is_approved: boolean;
  is_available: boolean;
  created_at: string;
}

const quickLinks = [
  { icon: Package, label: "Ressource eintragen", href: "/ressourcen/eintragen", color: "from-primary/20 to-primary/5" },
  { icon: Calendar, label: "Kalender", href: "/kalender", color: "from-accent/20 to-accent/5" },
  { icon: Users, label: "Best Practices", href: "/best-practices", color: "from-secondary/40 to-secondary/10" },
  { icon: Sparkles, label: "News", href: "/news", color: "from-primary/15 to-accent/10" },
];

export default function Mitgliederbereich() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profil");
  const [displayName, setDisplayName] = useState("");
  const [organization, setOrganization] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data as Profile | null;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setOrganization(profile.organization || "");
    }
  }, [profile]);

  const { data: myResources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ["my-resources", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("resources")
        .select("id, title, category, is_approved, is_available, created_at")
        .eq("submitted_by", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Resource[];
    },
    enabled: !!user,
  });

  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["members-directory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, organization, created_at")
        .order("display_name", { ascending: true });
      if (error) throw error;
      return data as Profile[];
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Nicht angemeldet");
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName.trim() || null,
          organization: organization.trim() || null,
        })
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["members-directory"] });
      toast({ title: "Profil aktualisiert", description: "Ihre Änderungen wurden gespeichert." });
    },
    onError: () => {
      toast({ title: "Fehler", description: "Profil konnte nicht gespeichert werden.", variant: "destructive" });
    },
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = { space: "Räume", equipment: "Technik", expertise: "Expertise", other: "Sonstiges" };
    return labels[category] || category;
  };

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("de-DE", { month: "long", year: "numeric" })
    : "";

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <motion.img
          src={heroImage}
          alt="Mitgliederbereich"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

        <div className="container relative h-full flex items-end pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl"
          >
            <Badge variant="secondary" className="mb-4 gap-1.5">
              <Shield className="h-3 w-3" />
              Interner Bereich
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Willkommen zurück
              {profile?.display_name && (
                <span className="text-gradient">, {profile.display_name}</span>
              )}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg">
              Verwalten Sie Ihr Profil, entdecken Sie Ressourcen und vernetzen Sie sich mit der Kulturgemeinschaft.
            </p>
            {memberSince && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                Mitglied seit {memberSince}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 border-b border-border/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
              >
                <Link
                  to={link.href}
                  className="group flex items-center gap-3 rounded-xl border border-border/50 bg-gradient-to-br p-4 transition-all hover:shadow-card hover:border-primary/20"
                  style={{}}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${link.color}`}>
                    <link.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium text-sm">{link.label}</span>
                  <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid h-12 rounded-xl bg-muted/50 p-1">
              <TabsTrigger value="profil" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Mein Profil</span>
                <span className="sm:hidden">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="ressourcen" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Meine Ressourcen</span>
                <span className="sm:hidden">Ressourcen</span>
              </TabsTrigger>
              <TabsTrigger value="anfragen" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
                <Inbox className="h-4 w-4" />
                <span className="hidden sm:inline">Anfragen</span>
                <span className="sm:hidden">Anfragen</span>
              </TabsTrigger>
              <TabsTrigger value="mitglieder" className="gap-2 rounded-lg data-[state=active]:shadow-sm">
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Mitgliederverzeichnis</span>
                <span className="sm:hidden">Mitglieder</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profil">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-8 lg:grid-cols-3"
              >
                {/* Profile Card */}
                <div className="lg:col-span-2">
                  <Card className="border-border/50 shadow-card">
                    <CardHeader>
                      <CardTitle className="text-xl">Profildetails</CardTitle>
                      <CardDescription>
                        Aktualisieren Sie Ihre Informationen, die anderen Mitgliedern angezeigt werden.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="email">E-Mail</Label>
                            <Input id="email" type="email" value={user.email || ""} disabled className="bg-muted/50" />
                            <p className="text-xs text-muted-foreground">Kann nicht geändert werden.</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Anzeigename</Label>
                            <Input
                              id="displayName"
                              placeholder="Ihr Name"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              maxLength={100}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organisation / Verein</Label>
                          <Input
                            id="organization"
                            placeholder="z.B. Kulturverein Braunschweig e.V."
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            maxLength={200}
                          />
                        </div>
                        <Button type="submit" disabled={updateProfileMutation.isPending} className="gap-2">
                          {updateProfileMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          Speichern
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Stats Sidebar */}
                <div className="space-y-4">
                  <Card className="border-border/50 shadow-card bg-gradient-to-br from-primary/5 to-transparent">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                      <p className="font-display text-lg font-semibold">
                        {profile?.display_name || user.email?.split("@")[0]}
                      </p>
                      {profile?.organization && (
                        <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
                          <Building className="h-3 w-3" />
                          {profile.organization}
                        </p>
                      )}
                      {memberSince && (
                        <p className="text-xs text-muted-foreground mt-2">Mitglied seit {memberSince}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 shadow-card">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Ihre Aktivität</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Ressourcen</span>
                          <Badge variant="secondary">{myResources.length}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Freigegeben</span>
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {myResources.filter(r => r.is_approved).length}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Ausstehend</span>
                          <Badge variant="outline">
                            {myResources.filter(r => !r.is_approved).length}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="ressourcen">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50 shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Meine Ressourcen</CardTitle>
                        <CardDescription>Übersicht aller von Ihnen eingetragenen Ressourcen.</CardDescription>
                      </div>
                      <Button asChild>
                        <Link to="/ressourcen/eintragen" className="gap-2">
                          <Package className="h-4 w-4" />
                          Neue Ressource
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {resourcesLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : myResources.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                          <Package className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground mb-4">Sie haben noch keine Ressourcen eingetragen.</p>
                        <Button variant="outline" asChild>
                          <Link to="/ressourcen/eintragen">Jetzt Ressource eintragen</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {myResources.map((resource, i) => (
                          <motion.div
                            key={resource.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                          >
                            <Card className="bg-muted/20 border-border/30 hover:shadow-card transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="space-y-1 flex-1 min-w-0">
                                    <p className="font-medium truncate">{resource.title}</p>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Badge variant="outline" className="text-xs">
                                        {getCategoryLabel(resource.category)}
                                      </Badge>
                                      <span>•</span>
                                      <span>{new Date(resource.created_at).toLocaleDateString("de-DE")}</span>
                                    </div>
                                  </div>
                                  {resource.is_approved ? (
                                    <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20 shrink-0">
                                      <Check className="h-3 w-3" />
                                      Freigegeben
                                    </Badge>
                                  ) : (
                                    <Badge variant="secondary" className="shrink-0">Ausstehend</Badge>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Members Directory Tab */}
            <TabsContent value="mitglieder">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/50 shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Mitgliederverzeichnis</CardTitle>
                        <CardDescription>Alle registrierten Mitglieder des Kulturrats.</CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-sm">
                        {members.length} Mitglieder
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {membersLoading ? (
                      <div className="flex justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : members.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                          <Users className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-muted-foreground">Noch keine Mitglieder registriert.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {members.map((member, i) => (
                          <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.03 }}
                          >
                            <Card className="bg-muted/20 border-border/30 hover:shadow-card transition-all group">
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 text-primary transition-transform group-hover:scale-105">
                                    <User className="h-5 w-5" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium truncate">
                                      {member.display_name || "Unbenannt"}
                                    </p>
                                    {member.organization && (
                                      <p className="text-sm text-muted-foreground flex items-center gap-1 truncate">
                                        <Building className="h-3 w-3 flex-shrink-0" />
                                        {member.organization}
                                      </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Seit{" "}
                                      {new Date(member.created_at).toLocaleDateString("de-DE", {
                                        month: "long",
                                        year: "numeric",
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
