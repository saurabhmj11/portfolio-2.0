import { useEffect } from "react";
import { useLocation } from "react-router-dom";
/// <reference types="vite/client" />
import ReactGA from "react-ga4";

const Analytics = () => {
    const location = useLocation();

    useEffect(() => {
        // Initialize GA4 only once if measurement ID is present
        const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID; // User to set this in .env

        if (measurementId && !window.GA_INITIALIZED) {
            ReactGA.initialize(measurementId);
            window.GA_INITIALIZED = true;
        }

        if (measurementId) {
            ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
        }
    }, [location]);

    return null;
};

export default Analytics;

// Add type verification to window if needed in a d.ts file, or just ignore for now
declare global {
    interface Window {
        GA_INITIALIZED?: boolean;
    }
}
