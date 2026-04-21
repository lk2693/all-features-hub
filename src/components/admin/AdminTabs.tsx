import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, FileText, Settings, BookOpen, Calendar, BarChart3, Users, Inbox, Home, Info } from "lucide-react";

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export function AdminTabs({ activeTab, onTabChange, children }: AdminTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-9 mb-8">
        <TabsTrigger value="statistics" className="flex items-center gap-2">
        <TabsTrigger value="statistics" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Statistik</span>
        </TabsTrigger>
        <TabsTrigger value="resources" className="flex items-center gap-2">
          <Folder className="h-4 w-4" />
          <span className="hidden sm:inline">Ressourcen</span>
        </TabsTrigger>
        <TabsTrigger value="requests" className="flex items-center gap-2">
          <Inbox className="h-4 w-4" />
          <span className="hidden sm:inline">Anfragen</span>
        </TabsTrigger>
        <TabsTrigger value="news" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">News</span>
        </TabsTrigger>
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">Kalender</span>
        </TabsTrigger>
        <TabsTrigger value="best-practices" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="hidden sm:inline">Best Practices</span>
        </TabsTrigger>
        <TabsTrigger value="vorstand" className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Vorstand</span>
        </TabsTrigger>
        <TabsTrigger value="home" className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Startseite</span>
        </TabsTrigger>
        <TabsTrigger value="cms" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">CMS</span>
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

export { TabsContent };
