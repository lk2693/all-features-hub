import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Package, Users, Mail, Phone, Building, Loader2, Save, Check } from "lucide-react";
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

export default function Mitgliederbereich() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profil");

  // Profile form state
  const [displayName, setDisplayName] = useState("");
  const [organization, setOrganization] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch user profile
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

  // Populate form when profile loads
  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setOrganization(profile.organization || "");
    }
  }, [profile]);

  // Fetch user's resources
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

  // Fetch member directory (all profiles)
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

  // Update profile mutation
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
      toast({
        title: "Profil aktualisiert",
        description: "Ihre Änderungen wurden gespeichert.",
      });
    },
    onError: (error) => {
      toast({
        title: "Fehler",
        description: "Profil konnte nicht gespeichert werden.",
        variant: "destructive",
      });
      console.error("Profile update error:", error);
    },
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      space: "Räume",
      equipment: "Technik",
      expertise: "Expertise",
      other: "Sonstiges",
    };
    return labels[category] || category;
  };

  if (authLoading || profileLoading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge variant="secondary" className="mb-4">
              Interner Bereich
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Mitgliederbereich
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Willkommen, {profile?.display_name || user.email?.split("@")[0]}! Verwalten Sie Ihr Profil 
              und entdecken Sie die Ressourcen unserer Gemeinschaft.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="profil" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Mein Profil</span>
                <span className="sm:hidden">Profil</span>
              </TabsTrigger>
              <TabsTrigger value="ressourcen" className="gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Meine Ressourcen</span>
                <span className="sm:hidden">Ressourcen</span>
              </TabsTrigger>
              <TabsTrigger value="mitglieder" className="gap-2">
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
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Profildetails</CardTitle>
                    <CardDescription>
                      Aktualisieren Sie Ihre Informationen, die anderen Mitgliedern angezeigt werden.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email">E-Mail</Label>
                          <Input
                            id="email"
                            type="email"
                            value={user.email || ""}
                            disabled
                            className="bg-muted"
                          />
                          <p className="text-xs text-muted-foreground">
                            Die E-Mail-Adresse kann nicht geändert werden.
                          </p>
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
                      <Button
                        type="submit"
                        disabled={updateProfileMutation.isPending}
                        className="gap-2"
                      >
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
              </motion.div>
            </TabsContent>

            {/* Resources Tab */}
            <TabsContent value="ressourcen">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Meine Ressourcen</CardTitle>
                        <CardDescription>
                          Übersicht aller von Ihnen eingetragenen Ressourcen.
                        </CardDescription>
                      </div>
                      <Button asChild>
                        <a href="/ressourcen/eintragen">Neue Ressource</a>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {resourcesLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : myResources.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>Sie haben noch keine Ressourcen eingetragen.</p>
                        <Button variant="link" asChild className="mt-2">
                          <a href="/ressourcen/eintragen">Jetzt Ressource eintragen</a>
                        </Button>
                      </div>
                    ) : (
                      <div className="divide-y divide-border">
                        {myResources.map((resource) => (
                          <div
                            key={resource.id}
                            className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                          >
                            <div className="space-y-1">
                              <p className="font-medium">{resource.title}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {getCategoryLabel(resource.category)}
                                </Badge>
                                <span>•</span>
                                <span>
                                  {new Date(resource.created_at).toLocaleDateString("de-DE")}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {resource.is_approved ? (
                                <Badge className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                                  <Check className="h-3 w-3" />
                                  Freigegeben
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Wartet auf Freigabe</Badge>
                              )}
                            </div>
                          </div>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Mitgliederverzeichnis</CardTitle>
                    <CardDescription>
                      Alle registrierten Mitglieder des Kulturrats Braunschweig.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {membersLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : members.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                        <p>Noch keine Mitglieder registriert.</p>
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {members.map((member) => (
                          <Card key={member.id} className="bg-muted/30">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
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
                                    Mitglied seit{" "}
                                    {new Date(member.created_at).toLocaleDateString("de-DE", {
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
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
