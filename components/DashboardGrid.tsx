'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';

// Import all dashboard cards
import EmailCard from './cards/EmailCard';
import TaskCard from './cards/TaskCard';
import CalendarCard from './cards/CalendarCard';
import TodoCard from './cards/TodoCard';
import NotesCard from './cards/NotesCard';
import ActivityCard from './cards/ActivityCard';

interface CardConfig {
  id: string;
  component: React.ComponentType;
  title: string;
}

const AVAILABLE_CARDS: CardConfig[] = [
  { id: 'email', component: EmailCard, title: 'Email' },
  { id: 'task', component: TaskCard, title: 'Task' },
  { id: 'calendar', component: CalendarCard, title: 'Calendar' },
  { id: 'todo', component: TodoCard, title: 'To-Do\'s' },
  { id: 'notes', component: NotesCard, title: 'Notes' },
  { id: 'activity', component: ActivityCard, title: 'Activity' },
];

interface SortableCardProps {
  id: string;
  children: React.ReactNode;
}

function SortableCard({ id, children }: SortableCardProps) {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      {children}
    </div>
  );
}

export default function DashboardGrid() {
  const { cardOrder, updateCardOrder } = useDashboardLayout();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cardOrder.indexOf(active.id as string);
      const newIndex = cardOrder.indexOf(over.id as string);
      
      const newOrder = arrayMove(cardOrder, oldIndex, newIndex);
      updateCardOrder(newOrder);
    }
  };

  // Filter available cards based on current order
  const visibleCards = cardOrder
    .map(cardId => AVAILABLE_CARDS.find(card => card.id === cardId))
    .filter(Boolean) as CardConfig[];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6">
          {visibleCards.map((card) => (
            <SortableCard key={card.id} id={card.id}>
              <card.component />
            </SortableCard>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}