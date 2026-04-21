import { ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SortableItem {
  id: string;
}

interface SortableListProps<T extends SortableItem> {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  emptyLabel?: string;
  /** Optional confirmation before delete (return true to proceed). */
  onConfirmDelete?: (item: T) => boolean | Promise<boolean>;
}

function SortableRow<T extends SortableItem>({
  item,
  index,
  renderItem,
  onDelete,
}: {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => ReactNode;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn("p-3 flex gap-3 items-start", isDragging && "opacity-60 shadow-lg")}
    >
      <button
        type="button"
        className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        {...attributes}
        {...listeners}
        aria-label="Verschieben"
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">{renderItem(item, index)}</div>
      <Button type="button" variant="ghost" size="icon" onClick={onDelete} aria-label="Entfernen">
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </Card>
  );
}

/**
 * Generic sortable CRUD list using dnd-kit. Each item must have a stable `id`.
 */
export function SortableList<T extends SortableItem>({
  items,
  onChange,
  renderItem,
  onAdd,
  addLabel = "Hinzufügen",
  emptyLabel = "Noch keine Einträge.",
  onConfirmDelete,
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(items, oldIndex, newIndex));
  }

  async function handleDelete(item: T) {
    if (onConfirmDelete) {
      const ok = await onConfirmDelete(item);
      if (!ok) return;
    }
    onChange(items.filter((i) => i.id !== item.id));
  }

  return (
    <div className="space-y-3">
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed border-border rounded-lg">
          {emptyLabel}
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  index={idx}
                  renderItem={renderItem}
                  onDelete={() => handleDelete(item)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {onAdd && (
        <Button type="button" variant="outline" onClick={onAdd} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}