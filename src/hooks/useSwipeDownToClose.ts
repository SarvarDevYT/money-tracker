import React, { useState, useRef } from 'react';

/**
 * Provides touch handlers and inline vertical offset for swipe-down-to-dismiss bottom sheets.
 */
export const useSwipeDownToClose = (onClose: () => void, threshold: number = 80) => {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) {
      setDragY(dy);
    } else {
      setDragY(0);
    }
  };

  const onTouchEnd = () => {
    if (startY.current === null) return;
    if (dragY >= threshold) {
      setDragY(0);
      onClose();
    } else {
      setDragY(0);
    }
    startY.current = null;
    setIsDragging(false);
  };

  const sheetStyle: React.CSSProperties = {
    transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
    transition: isDragging ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  return {
    dragY,
    sheetStyle,
    handlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    },
  };
};
