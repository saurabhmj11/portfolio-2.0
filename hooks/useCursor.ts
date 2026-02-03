import { useEffect } from 'react';

export const useCursor = () => {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const moveCursor = (e: MouseEvent) => {
      cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
    };

    const growCursor = () => {
      cursor.style.transform += ' scale(1.5)';
    };

    const shrinkCursor = () => {
      cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
    };

    document.addEventListener('mousemove', moveCursor);
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', growCursor);
      el.addEventListener('mouseleave', shrinkCursor);
    });

    return () => {
      document.removeEventListener('mousemove', moveCursor);
      document.querySelectorAll('a, button').forEach(el => {
        el.removeEventListener('mouseenter', growCursor);
        el.removeEventListener('mouseleave', shrinkCursor);
      });
      document.body.removeChild(cursor);
    };
  }, []);
};