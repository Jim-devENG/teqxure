"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReorderableItem {
  id: string;
}

interface ReorderableListProps<T extends ReorderableItem> {
  items: T[];
  onReorder: (orderedIds: string[]) => void;
  renderItem: (item: T) => ReactNode;
}

export function ReorderableList<T extends ReorderableItem>({
  items,
  onReorder,
  renderItem,
}: ReorderableListProps<T>) {
  const [ordered, setOrdered] = useState(items);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useEffect(() => setOrdered(items), [items]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ordered.findIndex((item) => item.id === active.id);
    const newIndex = ordered.findIndex((item) => item.id === over.id);
    const next = arrayMove(ordered, oldIndex, newIndex);
    setOrdered(next);
    onReorder(next.map((item) => item.id));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ordered.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2">
          {ordered.map((item) => (
            <SortableRow key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableRow>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

function SortableRow({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-light-gray bg-white px-3 py-3",
        isDragging && "opacity-60",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-slate active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-4 w-4" strokeWidth={1.5} />
      </button>
      <div className="flex-1">{children}</div>
    </li>
  );
}
