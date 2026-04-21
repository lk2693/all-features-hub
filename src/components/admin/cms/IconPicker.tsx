import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Search } from "lucide-react";
import { getIcon, HOME_ICONS } from "@/lib/iconMap";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  label?: string;
  value?: string | null;
  onChange: (name: string) => void;
  /** Optional override list of icon names */
  icons?: readonly string[];
}

/**
 * Lucide icon picker for CMS editors. Lets admins pick an icon by name
 * from a curated list, with search.
 */
export function IconPicker({ label = "Icon", value, onChange, icons = HOME_ICONS }: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return icons;
    return icons.filter((n) => n.toLowerCase().includes(q));
  }, [icons, query]);

  const SelectedIcon = getIcon(value);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button type="button" variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <SelectedIcon className="h-4 w-4" />
              <span className="text-sm">{value || "Icon wählen…"}</span>
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="start">
          <div className="relative mb-2">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Suchen…"
              className="pl-8 h-9"
            />
          </div>
          <ScrollArea className="h-64">
            <div className="grid grid-cols-6 gap-1 pr-2">
              {filtered.map((name) => {
                const Icon = getIcon(name);
                const isSelected = value === name;
                return (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                    className={cn(
                      "aspect-square flex items-center justify-center rounded-md border border-transparent hover:bg-muted hover:border-border transition-colors",
                      isSelected && "bg-primary/10 border-primary text-primary"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="col-span-6 text-center text-sm text-muted-foreground py-4">Keine Icons gefunden</p>
              )}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
}