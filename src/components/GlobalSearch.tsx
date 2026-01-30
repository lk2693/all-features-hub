import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Folder, Loader2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  title: string;
  excerpt: string | null;
  type: "news" | "resource";
  category?: string;
  slug?: string;
}

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categoryLabels: Record<string, string> = {
  news: "News",
  foerderung: "Förderung",
  blog: "Blog",
};

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const searchTerm = `%${searchQuery.trim()}%`;

      // Search news_posts
      const { data: newsData, error: newsError } = await supabase
        .from("news_posts")
        .select("id, title, excerpt, slug, category")
        .eq("is_published", true)
        .or(`title.ilike.${searchTerm},excerpt.ilike.${searchTerm},content.ilike.${searchTerm}`)
        .limit(5);

      if (newsError) throw newsError;

      // Search resources
      const { data: resourceData, error: resourceError } = await supabase
        .from("resources")
        .select("id, title, description, category")
        .eq("is_approved", true)
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(5);

      if (resourceError) throw resourceError;

      const newsResults: SearchResult[] = (newsData || []).map((item) => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        type: "news" as const,
        category: item.category,
        slug: item.slug,
      }));

      const resourceResults: SearchResult[] = (resourceData || []).map((item) => ({
        id: item.id,
        title: item.title,
        excerpt: item.description,
        type: "resource" as const,
        category: item.category,
      }));

      setResults([...newsResults, ...resourceResults]);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, performSearch]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  }, [open]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const handleResultClick = (result: SearchResult) => {
    onOpenChange(false);
    if (result.type === "news" && result.slug) {
      navigate(`/news/${result.slug}`);
    } else if (result.type === "resource") {
      navigate("/ressourcen");
    }
  };

  const newsResults = results.filter((r) => r.type === "news");
  const resourceResults = results.filter((r) => r.type === "resource");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0 gap-0">
        <DialogHeader className="px-4 py-3 border-b border-border">
          <DialogTitle className="sr-only">Suche</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="News, Ressourcen durchsuchen..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px]">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!isLoading && hasSearched && results.length === 0 && (
            <div className="py-8 text-center text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Keine Ergebnisse für "{query}"</p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="p-2">
              {newsResults.length > 0 && (
                <div className="mb-4">
                  <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    News & Beiträge
                  </p>
                  {newsResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <FileText className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-foreground truncate">
                            {result.title}
                          </span>
                          {result.category && (
                            <Badge 
                              variant="outline" 
                              className={cn(
                                "shrink-0 text-xs",
                                result.category === "foerderung" && "border-warning text-warning",
                                result.category === "blog" && "border-primary text-primary"
                              )}
                            >
                              {categoryLabels[result.category] || result.category}
                            </Badge>
                          )}
                        </div>
                        {result.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {result.excerpt}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {resourceResults.length > 0 && (
                <div>
                  <p className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Ressourcen
                  </p>
                  {resourceResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <Folder className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-medium text-foreground truncate">
                            {result.title}
                          </span>
                          {result.category && (
                            <Badge variant="secondary" className="shrink-0 text-xs">
                              {result.category}
                            </Badge>
                          )}
                        </div>
                        {result.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {result.excerpt}
                          </p>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isLoading && !hasSearched && (
            <div className="py-8 text-center text-muted-foreground">
              <p className="text-sm">Beginnen Sie zu tippen um zu suchen</p>
              <p className="text-xs mt-1 opacity-70">
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">⌘</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">K</kbd> zum Öffnen
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
