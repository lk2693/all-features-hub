import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import { AdminTabs, TabsContent } from "@/components/admin/AdminTabs";
import { NewsManager } from "@/components/admin/NewsManager";
import { CMSEditor } from "@/components/admin/CMSEditor";
import { HomeEditor } from "@/components/admin/home-editor/HomeEditor";
import { ResourcesManager } from "@/components/admin/ResourcesManager";
import { RequestsManager } from "@/components/admin/RequestsManager";
import { BestPracticesManager } from "@/components/admin/BestPracticesManager";
import { EventsManager } from "@/components/admin/EventsManager";
import { StatisticsManager } from "@/components/admin/StatisticsManager";
import { VorstandManager } from "@/components/admin/VorstandManager";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("statistics");

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
        toast({
          title: "Zugriff verweigert",
          description: "Sie haben keine Berechtigung für den Admin-Bereich.",
          variant: "destructive",
        });
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, navigate, toast]);

  if (authLoading || adminLoading) {
    return (
      <Layout>
        <div className="container py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <ShieldAlert className="mx-auto h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold">Zugriff verweigert</h1>
          <p className="text-muted-foreground mt-2">
            Sie haben keine Berechtigung für diesen Bereich.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Verwalten Sie Ressourcen, News und Website-Inhalte
          </p>
        </div>

        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab}>
          <TabsContent value="statistics">
            <StatisticsManager />
          </TabsContent>
          <TabsContent value="resources">
            <ResourcesManager />
          </TabsContent>
          <TabsContent value="requests">
            <RequestsManager />
          </TabsContent>
          <TabsContent value="news">
            <NewsManager />
          </TabsContent>
          <TabsContent value="events">
            <EventsManager />
          </TabsContent>
          <TabsContent value="best-practices">
            <BestPracticesManager />
          </TabsContent>
          <TabsContent value="vorstand">
            <VorstandManager />
          </TabsContent>
          <TabsContent value="home">
            <HomeEditor />
          </TabsContent>
          <TabsContent value="cms">
            <CMSEditor />
          </TabsContent>
        </AdminTabs>
      </div>
    </Layout>
  );
}
