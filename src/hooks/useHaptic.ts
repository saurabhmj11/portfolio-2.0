import { useCallback } from 'react';
import useIsMobile from './useIsMobile';

const useHaptic = () => {
    const isMobile = useIsMobile();

    const trigger = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'light') => {
        if (!isMobile || typeof navigator === 'undefined' || !navigator.vibrate) return;

        switch (intensity) {
            case 'light':
                navigator.vibrate(5); // Very subtle tick
                break;
            case 'medium':
                navigator.vibrate(15); // Confirmation
                break;
            case 'heavy':
                navigator.vibrate([10, 50, 10]); // Error or major event
                break;
        }
    }, [isMobile]);

    return { trigger };
};

export default useHaptic;
