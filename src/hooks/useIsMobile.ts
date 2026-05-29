import { useState, useEffect } from 'react';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined" || typeof navigator === "undefined") return false;
        const userAgent = navigator.userAgent;
        return Boolean(
            userAgent.match(
                /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
            ) || window.innerWidth < 1024
        );
    });

    useEffect(() => {
        const checkMobile = () => {
            const userAgent = typeof window === "undefined" ? "" : navigator.userAgent;
            const mobile = Boolean(
                userAgent.match(
                    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
                ) || window.innerWidth < 1024
            );
            setIsMobile(mobile);
        };

        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    return isMobile;
};

export default useIsMobile;
