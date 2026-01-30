import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  FileText,
  Calendar,
  Mail,
  Folder,
  BookOpen,
  TrendingUp,
  CheckCircle,
  Clock,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface StatCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  description?: string;
  trend?: number;
}

export function StatisticsManager() {
  // Fetch all statistics in parallel
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-statistics"],
    queryFn: async () => {
      const [
        profilesRes,
        resourcesRes,
        approvedResourcesRes,
        newsRes,
        publishedNewsRes,
        eventsRes,
        publishedEventsRes,
        subscribersRes,
        confirmedSubscribersRes,
        bestPracticesRes,
        publishedBestPracticesRes,
        resourceCategoriesRes,
        eventCategoriesRes,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("resources").select("id", { count: "exact", head: true }),
        supabase.from("resources").select("id", { count: "exact", head: true }).eq("is_approved", true),
        supabase.from("news_posts").select("id", { count: "exact", head: true }),
        supabase.from("news_posts").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
        supabase.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("is_confirmed", true),
        supabase.from("best_practices").select("id", { count: "exact", head: true }),
        supabase.from("best_practices").select("id", { count: "exact", head: true }).eq("is_published", true),
        supabase.from("resources").select("category"),
        supabase.from("events").select("category"),
      ]);

      // Process resource categories
      const resourceCategories: Record<string, number> = {};
      resourceCategoriesRes.data?.forEach((r) => {
        resourceCategories[r.category] = (resourceCategories[r.category] || 0) + 1;
      });

      // Process event categories
      const eventCategories: Record<string, number> = {};
      eventCategoriesRes.data?.forEach((e) => {
        eventCategories[e.category] = (eventCategories[e.category] || 0) + 1;
      });

      return {
        profiles: profilesRes.count || 0,
        resources: resourcesRes.count || 0,
        approvedResources: approvedResourcesRes.count || 0,
        news: newsRes.count || 0,
        publishedNews: publishedNewsRes.count || 0,
        events: eventsRes.count || 0,
        publishedEvents: publishedEventsRes.count || 0,
        subscribers: subscribersRes.count || 0,
        confirmedSubscribers: confirmedSubscribersRes.count || 0,
        bestPractices: bestPracticesRes.count || 0,
        publishedBestPractices: publishedBestPracticesRes.count || 0,
        resourceCategories,
        eventCategories,
      };
    },
  });

  const statCards: StatCard[] = stats
    ? [
        {
          title: "Registrierte Nutzer",
          value: stats.profiles,
          icon: <Users className="h-5 w-5 text-primary" />,
        },
        {
          title: "Ressourcen",
          value: stats.resources,
          icon: <Folder className="h-5 w-5 text-blue-500" />,
          description: `${stats.approvedResources} freigegeben`,
        },
        {
          title: "News-Artikel",
          value: stats.news,
          icon: <FileText className="h-5 w-5 text-green-500" />,
          description: `${stats.publishedNews} veröffentlicht`,
        },
        {
          title: "Veranstaltungen",
          value: stats.events,
          icon: <Calendar className="h-5 w-5 text-orange-500" />,
          description: `${stats.publishedEvents} veröffentlicht`,
        },
        {
          title: "Newsletter-Abonnenten",
          value: stats.subscribers,
          icon: <Mail className="h-5 w-5 text-purple-500" />,
          description: `${stats.confirmedSubscribers} bestätigt`,
        },
        {
          title: "Best Practices",
          value: stats.bestPractices,
          icon: <BookOpen className="h-5 w-5 text-cyan-500" />,
          description: `${stats.publishedBestPractices} veröffentlicht`,
        },
      ]
    : [];

  const categoryColors = [
    "hsl(var(--primary))",
    "hsl(220, 70%, 50%)",
    "hsl(160, 60%, 45%)",
    "hsl(30, 80%, 55%)",
    "hsl(280, 60%, 55%)",
    "hsl(340, 70%, 50%)",
  ];

  const resourceCategoryData = stats
    ? Object.entries(stats.resourceCategories).map(([name, value], index) => ({
        name: getCategoryLabel(name),
        value,
        fill: categoryColors[index % categoryColors.length],
      }))
    : [];

  const eventCategoryData = stats
    ? Object.entries(stats.eventCategories).map(([name, value], index) => ({
        name: getEventCategoryLabel(name),
        value,
        fill: categoryColors[index % categoryColors.length],
      }))
    : [];

  function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      raeume: "Räume",
      technik: "Technik",
      beratung: "Beratung",
      material: "Material",
      sonstiges: "Sonstiges",
    };
    return labels[category] || category;
  }

  function getEventCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      sitzung: "Sitzung",
      frist: "Frist",
      networking: "Networking",
      workshop: "Workshop",
      veranstaltung: "Veranstaltung",
    };
    return labels[category] || category;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Übersicht
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                {stat.description && (
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {stat.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Resource Categories */}
        {resourceCategoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Folder className="h-4 w-4" />
                Ressourcen nach Kategorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Anzahl" },
                }}
                className="h-[250px]"
              >
                <BarChart data={resourceCategoryData} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}

        {/* Event Categories */}
        {eventCategoryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Veranstaltungen nach Kategorie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: { label: "Anzahl" },
                }}
                className="h-[250px]"
              >
                <PieChart>
                  <Pie
                    data={eventCategoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={false}
                  >
                    {eventCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Veröffentlichungsstatus
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div>
                <p className="text-sm font-medium">News</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.publishedNews || 0} / {stats?.news || 0} veröffentlicht
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <div>
                <p className="text-sm font-medium">Events</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.publishedEvents || 0} / {stats?.events || 0} veröffentlicht
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium">Ressourcen</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.approvedResources || 0} / {stats?.resources || 0} freigegeben
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-purple-500" />
              <div>
                <p className="text-sm font-medium">Newsletter</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.confirmedSubscribers || 0} / {stats?.subscribers || 0} bestätigt
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
