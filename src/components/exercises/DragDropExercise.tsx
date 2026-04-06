"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  type DragStartEvent,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Check, X } from "lucide-react";
import type { Exercise, DragItem, DropZone } from "@/types";
import HintButton from "./HintButton";

/* ─── Draggable item ─── */
function DraggableItem({
  item,
  isPlaced,
  disabled,
}: {
  item: DragItem;
  isPlaced: boolean;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: item.id,
    disabled,
  });

  if (isPlaced) return null;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 bg-editor-surface border border-editor-border rounded-lg px-4 py-2 font-mono text-sm text-neon-blue cursor-grab active:cursor-grabbing select-none transition-all ${
        isDragging ? "opacity-30 scale-95" : "hover:border-neon-blue/50 hover:bg-editor-hover"
      }`}
    >
      <GripVertical className="w-4 h-4 text-editor-muted flex-shrink-0" />
      {item.content}
    </div>
  );
}

/* ─── Droppable zone (supports multiple items) ─── */
function DroppableZone({
  zone,
  placedItemIds,
  itemResults,
  submitted,
  allItems,
  onRemove,
  disabled,
}: {
  zone: DropZone;
  placedItemIds: string[];
  itemResults?: Map<string, boolean>;
  submitted: boolean;
  allItems: DragItem[];
  onRemove: (itemId: string) => void;
  disabled: boolean;
}) {
  const { isOver, setNodeRef } = useDroppable({ id: zone.id });
  const placedItems = placedItemIds
    .map((id) => allItems.find((i) => i.id === id))
    .filter(Boolean) as DragItem[];

  const allCorrect = submitted && placedItems.length > 0 && placedItems.every((item) => itemResults?.get(item.id));
  const anyWrong = submitted && placedItems.some((item) => itemResults?.get(item.id) === false);

  const borderClass = submitted
    ? allCorrect
      ? "border-neon-green bg-neon-green/5"
      : anyWrong
      ? "border-neon-red bg-neon-red/5"
      : "border-editor-border"
    : isOver
    ? "border-neon-blue bg-neon-blue/5"
    : "border-editor-border";

  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-lg border-2 border-dashed p-4 min-h-[60px] transition-colors ${borderClass} ${
        placedItems.length === 0 ? "bg-editor-bg" : "bg-editor-surface"
      }`}
    >
      <span className="text-xs font-semibold text-editor-muted uppercase tracking-wider">
        {zone.label}
      </span>

      {placedItems.length > 0 ? (
        <div className="mt-2 flex flex-col gap-1.5">
          {placedItems.map((item) => {
            const correct = itemResults?.get(item.id);
            return (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <span className="font-mono text-sm text-neon-blue">{item.content}</span>
                <div className="flex items-center gap-1">
                  {submitted && correct !== undefined && (
                    correct ? (
                      <Check className="w-4 h-4 text-neon-green" />
                    ) : (
                      <X className="w-4 h-4 text-neon-red" />
                    )
                  )}
                  {!disabled && (
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-1 rounded hover:bg-editor-hover text-editor-muted hover:text-editor-text transition-colors"
                      title="Quitar"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-2 text-xs text-editor-muted italic">
          Arrastra un elemento aqui
        </div>
      )}
    </div>
  );
}

/* ─── Main component ─── */
interface DragDropExerciseProps {
  exercise: Exercise;
  onSubmit: (placements: Record<string, string>) => void;
}

export default function DragDropExercise({
  exercise,
  onSubmit,
}: DragDropExerciseProps) {
  const items = exercise.dragItems ?? [];
  const zones = exercise.dropZones ?? [];

  // placements: zoneId -> itemId[] (multiple items per zone)
  const [placements, setPlacements] = useState<Record<string, string[]>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const placedItemIds = new Set(Object.values(placements).flat());

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const itemId = String(active.id);
    const zoneId = String(over.id);

    // Check it's a valid zone
    if (!zones.find((z) => z.id === zoneId)) return;

    setPlacements((prev) => {
      const next: Record<string, string[]> = {};
      // Deep copy and remove item from any previous zone
      for (const [key, arr] of Object.entries(prev)) {
        next[key] = arr.filter((id) => id !== itemId);
      }
      // Add to new zone
      if (!next[zoneId]) next[zoneId] = [];
      next[zoneId].push(itemId);
      return next;
    });
  };

  const handleRemove = (itemId: string) => {
    setPlacements((prev) => {
      const next: Record<string, string[]> = {};
      for (const [key, arr] of Object.entries(prev)) {
        next[key] = arr.filter((id) => id !== itemId);
      }
      return next;
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
    // Convert to itemId->zoneId for the callback
    const result: Record<string, string> = {};
    for (const [zoneId, itemIds] of Object.entries(placements)) {
      for (const itemId of itemIds) {
        result[itemId] = zoneId;
      }
    }
    onSubmit(result);
  };

  // Per-item results for display
  const getItemResults = (): Map<string, boolean> => {
    const results = new Map<string, boolean>();
    if (!submitted) return results;
    for (const [zoneId, itemIds] of Object.entries(placements)) {
      for (const itemId of itemIds) {
        const item = items.find((i) => i.id === itemId);
        results.set(itemId, item?.correctZone === zoneId);
      }
    }
    return results;
  };

  const itemResults = getItemResults();
  const allPlaced = items.length > 0 && placedItemIds.size === items.length;
  const allCorrect = submitted && items.every((item) => itemResults.get(item.id) === true);
  const activeItem = items.find((i) => i.id === activeId);

  return (
    <div className="flex flex-col gap-6">
      {/* Prompt */}
      <div className="text-lg font-semibold text-editor-text leading-relaxed">
        {exercise.prompt}
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Item bank */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-2"
        >
          <span className="text-xs font-semibold text-editor-muted uppercase tracking-wider px-1">
            Elementos
          </span>
          <div className="flex flex-wrap gap-2 p-4 rounded-xl bg-editor-bg border border-editor-border min-h-[52px]">
            {items.map((item) => (
              <DraggableItem
                key={item.id}
                item={item}
                isPlaced={placedItemIds.has(item.id)}
                disabled={submitted}
              />
            ))}
            {items.every((i) => placedItemIds.has(i.id)) && (
              <span className="text-xs text-editor-muted italic py-2">
                Todos los elementos han sido colocados
              </span>
            )}
          </div>
        </motion.div>

        {/* Drop zones */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col gap-2"
        >
          <span className="text-xs font-semibold text-editor-muted uppercase tracking-wider px-1">
            Zonas
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {zones.map((zone) => (
              <DroppableZone
                key={zone.id}
                zone={zone}
                placedItemIds={placements[zone.id] ?? []}
                itemResults={submitted ? itemResults : undefined}
                submitted={submitted}
                allItems={items}
                onRemove={handleRemove}
                disabled={submitted}
              />
            ))}
          </div>
        </motion.div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeItem && (
            <div className="flex items-center gap-2 bg-editor-surface border-2 border-neon-blue rounded-lg px-4 py-2 font-mono text-sm text-neon-blue shadow-xl shadow-neon-blue/20 cursor-grabbing">
              <GripVertical className="w-4 h-4 text-neon-blue" />
              {activeItem.content}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* Result */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${
              allCorrect
                ? "bg-neon-green/10 border-neon-green/30 text-neon-green"
                : "bg-neon-red/10 border-neon-red/30 text-neon-red"
            }`}
          >
            {allCorrect ? (
              <>
                <Check className="w-5 h-5" />
                Todas las colocaciones son correctas!
              </>
            ) : (
              <>
                <X className="w-5 h-5" />
                Algunas colocaciones son incorrectas.
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      <AnimatePresence>
        {submitted && exercise.explanation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 rounded-xl bg-neon-blue/5 border border-neon-blue/15 text-sm text-editor-text leading-relaxed">
              <span className="font-semibold text-neon-blue">Explicacion: </span>
              {exercise.explanation}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint + Submit */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {exercise.hint && !submitted && <HintButton hint={exercise.hint} />}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allPlaced}
            className="ml-auto px-6 py-2.5 rounded-xl bg-neon-blue text-white font-semibold text-sm hover:bg-neon-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-neon-blue/20"
          >
            Verificar
          </button>
        )}
      </div>
    </div>
  );
}
