import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, FileText, Settings } from "lucide-react";

interface AdminTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  children: React.ReactNode;
}

export function AdminTabs({ activeTab, onTabChange, children }: AdminTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="resources" className="flex items-center gap-2">
          <Folder className="h-4 w-4" />
          Ressourcen
        </TabsTrigger>
        <TabsTrigger value="news" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          News
        </TabsTrigger>
        <TabsTrigger value="cms" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          CMS
        </TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  );
}

export { TabsContent };
