import React, { useEffect, useState } from 'react';
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { interfaceLabels, InterfaceOption } from '../../types';

const slotLabels = [
  '1. Most effective',
  '2. Moderately effective',
  '3. Least effective',
];

const initialPool: InterfaceOption[] = [
  InterfaceOption.Benchmark,
  InterfaceOption.SingleAxisCarousel,
  InterfaceOption.MultiAxisCarousel,
];

type RankingQuestionProps = {
  onChange: (ranked: InterfaceOption[]) => void;
};

export const RankingQuestion = ({ onChange }: RankingQuestionProps) => {
  const [slots, setSlots] = useState<(InterfaceOption | null)[]>([
    null,
    null,
    null,
  ]);
  const [pool, setPool] = useState<InterfaceOption[]>(initialPool);

  // sensors for mouse/touch & keyboard
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetAll = () => {
    setSlots([null, null, null]);
    setPool([...initialPool]);
    onChange([]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as InterfaceOption;
    const overId = String(over.id);

    // 1) Dropped into a slot
    if (overId.startsWith('slot-')) {
      const idx = Number(overId.split('-')[1]);
      setSlots((prev) => {
        const newSlots = [...prev];
        // if slot had something, return it to pool
        if (newSlots[idx]) {
          setPool((p) => [...p, newSlots[idx]!]);
        }
        newSlots[idx] = activeId;
        return newSlots;
      });
      // remove from pool
      setPool((p) => p.filter((x) => x !== activeId));
    }
    // 2) Dropped back into pool
    else {
      setPool((p) => {
        if (!p.includes(activeId)) return [...p, activeId];
        return p;
      });
      // if it came from a slot, clear that slot
      setSlots((prev) => prev.map((s) => (s === activeId ? null : s)));
    }
  };

  useEffect(() => {
    const currentRank = slots.map((s) => s!).filter(Boolean);
    if (currentRank.length === 3) {
      onChange(currentRank);
    }
  }, [slots, onChange]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={[
          ...initialPool, // pool item IDs
          ...slots.filter((s): s is InterfaceOption => !!s).map((s) => s),
        ]}
        strategy={rectSortingStrategy}
      >
        <div className="flex gap-6">
          {/* Left: slots (droppables) */}
          <div className="space-y-4 w-1/2">
            {slots.map((item, idx) => (
              <SortableSlot key={idx} id={`slot-${idx}`}>
                <div className="text-sm font-medium mb-1">
                  {slotLabels[idx]}
                </div>
                {item ? (
                  <div className="p-2 bg-white rounded shadow text-center">
                    {interfaceLabels[item]}
                  </div>
                ) : (
                  <div className="p-2 border-2 border-dashed text-gray-400 text-center rounded">
                    drop here
                  </div>
                )}
              </SortableSlot>
            ))}
          </div>

          {/* Right: pool */}
          <div className="relative flex-1 p-4 border-2 rounded-md bg-antiflashWhite min-h-[200px]">
            <div className="text-sm font-medium mb-2">Available Interfaces</div>
            <div className="space-y-2">
              {pool.map((id) => (
                <SortableItem key={id} id={id}>
                  {interfaceLabels[id]}
                </SortableItem>
              ))}
            </div>

            <button
              type="button"
              onClick={resetAll}
              className="
              absolute bottom-2 right-2
              bg-darkOrange text-white text-xs px-4 py-2 rounded-full
              hover:bg-darkOrange hover:bg-darkOrange/80 transition
            "
            >
              Reset
            </button>
          </div>
        </div>
      </SortableContext>
    </DndContext>
  );
};

// a slot is a droppable that doesn’t move itself
function SortableSlot({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const { setNodeRef } = useSortable({ id, disabled: true });
  return (
    <div
      ref={setNodeRef}
      id={id}
      className="w-full min-h-[64px] p-2 bg-lightGreen rounded-md"
    >
      {children}
    </div>
  );
}

// a draggable item
function SortableItem({
  id,
  children,
}: {
  id: InterfaceOption;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-2 bg-white rounded shadow cursor-move
        ${isDragging ? 'text-darkGreen' : ''}
      `}
    >
      {children}
    </div>
  );
}
