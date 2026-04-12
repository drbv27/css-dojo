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
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
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
      className={`flex items-center gap-2.5 bg-editor-surface border border-editor-border rounded-xl px-4 py-3 sm:px-4 sm:py-2.5 font-mono text-sm text-neon-blue cursor-grab active:cursor-grabbing select-none transition-all touch-none ${
        isDragging ? "opacity-30 scale-95" : "hover:border-neon-blue/50 hover:bg-editor-hover"
      }`}
    >
      <GripVertical className="w-5 h-5 sm:w-4 sm:h-4 text-editor-muted flex-shrink-0" />
      <span className="text-base sm:text-sm">{item.content}</span>
    </div>
  );
}

/* ─── Droppable zone ─── */
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
    ? "border-neon-blue bg-neon-blue/5 scale-[1.02]"
    : "border-editor-border";

  return (
    <div
      ref={setNodeRef}
      className={`relative rounded-xl border-2 border-dashed p-4 min-h-[72px] sm:min-h-[60px] transition-all ${borderClass} ${
        placedItems.length === 0 ? "bg-editor-bg" : "bg-editor-surface"
      }`}
    >
      <span className="text-xs font-semibold text-editor-muted uppercase tracking-wider">
        {zone.label}
      </span>

      {placedItems.length > 0 ? (
        <div className="mt-2 flex flex-col gap-2">
          {placedItems.map((item) => {
            const correct = itemResults?.get(item.id);
            return (
              <div key={item.id} className="flex items-center justify-between gap-2 bg-editor-bg/50 rounded-lg px-3 py-2">
                <span className="font-mono text-sm text-neon-blue">{item.content}</span>
                <div className="flex items-center gap-1.5">
                  {submitted && correct !== undefined && (
                    correct ? (
                      <Check className="w-5 h-5 text-neon-green" />
                    ) : (
                      <X className="w-5 h-5 text-neon-red" />
                    )
                  )}
                  {!disabled && (
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-1.5 rounded-lg hover:bg-editor-hover text-editor-muted hover:text-editor-text transition-colors"
                      title="Quitar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-2 text-xs text-editor-muted italic">
          Arrastra aqui
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

  const [placements, setPlacements] = useState<Record<string, string[]>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Better sensors for mobile: touch with delay, pointer with distance
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 8 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

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

    if (!zones.find((z) => z.id === zoneId)) return;

    setPlacements((prev) => {
      const next: Record<string, string[]> = {};
      for (const [key, arr] of Object.entries(prev)) {
        next[key] = arr.filter((id) => id !== itemId);
      }
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

  // Alternative: tap to select, tap zone to place (for mobile)
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleTapItem = (itemId: string) => {
    if (submitted) return;
    setSelectedItem(selectedItem === itemId ? null : itemId);
  };

  const handleTapZone = (zoneId: string) => {
    if (submitted || !selectedItem) return;
    setPlacements((prev) => {
      const next: Record<string, string[]> = {};
      for (const [key, arr] of Object.entries(prev)) {
        next[key] = arr.filter((id) => id !== selectedItem);
      }
      if (!next[zoneId]) next[zoneId] = [];
      next[zoneId].push(selectedItem);
      return next;
    });
    setSelectedItem(null);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    const result: Record<string, string> = {};
    for (const [zoneId, itemIds] of Object.entries(placements)) {
      for (const itemId of itemIds) {
        result[itemId] = zoneId;
      }
    }
    onSubmit(result);
  };

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
    <div className="flex flex-col gap-5">
      {/* Prompt */}
      <div className="text-base sm:text-lg font-semibold text-editor-text leading-relaxed">
        {exercise.prompt}
      </div>

      {/* Mobile hint */}
      <p className="text-xs text-editor-muted sm:hidden">
        Toca un elemento y luego toca la zona donde quieres colocarlo. Tambien puedes arrastrar.
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
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
          <div className="flex flex-wrap gap-2.5 p-4 rounded-xl bg-editor-bg border border-editor-border min-h-[56px]">
            {items.map((item) => {
              const isPlaced = placedItemIds.has(item.id);
              if (isPlaced) return null;
              return (
                <div key={item.id} className="relative">
                  {/* Tap-to-select overlay for mobile */}
                  <div
                    onClick={() => handleTapItem(item.id)}
                    className={`absolute inset-0 z-10 rounded-xl sm:hidden ${
                      selectedItem === item.id ? "ring-2 ring-neon-blue ring-offset-2 ring-offset-editor-bg" : ""
                    }`}
                  />
                  <DraggableItem
                    item={item}
                    isPlaced={false}
                    disabled={submitted}
                  />
                  {selectedItem === item.id && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-neon-blue sm:hidden" />
                  )}
                </div>
              );
            })}
            {items.every((i) => placedItemIds.has(i.id)) && (
              <span className="text-xs text-editor-muted italic py-2">
                Todos colocados
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
            {selectedItem ? "Toca una zona para colocar" : "Zonas"}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {zones.map((zone) => (
              <div
                key={zone.id}
                onClick={() => handleTapZone(zone.id)}
                className={`${selectedItem ? "cursor-pointer sm:cursor-default" : ""}`}
              >
                <DroppableZone
                  zone={zone}
                  placedItemIds={placements[zone.id] ?? []}
                  itemResults={submitted ? itemResults : undefined}
                  submitted={submitted}
                  allItems={items}
                  onRemove={handleRemove}
                  disabled={submitted}
                />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeItem && (
            <div className="flex items-center gap-2.5 bg-editor-surface border-2 border-neon-blue rounded-xl px-5 py-3 font-mono text-base text-neon-blue shadow-xl shadow-neon-blue/20 cursor-grabbing">
              <GripVertical className="w-5 h-5 text-neon-blue" />
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
            className="ml-auto px-6 py-3 sm:py-2.5 rounded-xl bg-neon-blue text-white font-semibold text-sm hover:bg-neon-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-neon-blue/20"
          >
            Verificar
          </button>
        )}
      </div>
    </div>
  );
}
