import { useState, useEffect } from 'react';

export interface DashboardLayout {
  cardOrder: string[];
}

const defaultCardOrder = ['email', 'task', 'calendar', 'todo', 'notes', 'activity'];

export const useDashboardLayout = () => {
  const [cardOrder, setCardOrder] = useState<string[]>(defaultCardOrder);

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem('dashboardLayout');
    if (saved) {
      try {
        const layout: DashboardLayout = JSON.parse(saved);
        setCardOrder(layout.cardOrder);
      } catch (error) {
        console.error('Failed to parse dashboard layout:', error);
      }
    }
  }, []);

  const updateCardOrder = (newOrder: string[]) => {
    setCardOrder(newOrder);
    // Save to localStorage
    const layout: DashboardLayout = { cardOrder: newOrder };
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
  };

  return {
    cardOrder,
    updateCardOrder
  };
};