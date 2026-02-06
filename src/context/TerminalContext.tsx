import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type LogType = 'system' | 'info' | 'success' | 'warning' | 'error';

export interface TerminalLog {
    id: string;
    timestamp: number;
    message: string;
    type: LogType;
    source?: string;
}

interface TerminalContextType {
    logs: TerminalLog[];
    addLog: (message: string, type?: LogType, source?: string) => void;
    clearLogs: () => void;
    systemStatus: 'IDLE' | 'SCANNING' | 'PROCESSING' | 'ERROR';
    setSystemStatus: (status: 'IDLE' | 'SCANNING' | 'PROCESSING' | 'ERROR') => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export const TerminalProvider = ({ children }: { children: ReactNode }) => {
    const [logs, setLogs] = useState<TerminalLog[]>([]);
    const [systemStatus, setSystemStatus] = useState<'IDLE' | 'SCANNING' | 'PROCESSING' | 'ERROR'>('IDLE');

    const addLog = useCallback((message: string, type: LogType = 'system', source: string = 'SYS') => {
        const newLog: TerminalLog = {
            id: Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            message,
            type,
            source
        };

        setLogs(prev => {
            // Keep only last 50 logs to prevent memory issues
            const newLogs = [...prev, newLog];
            if (newLogs.length > 50) return newLogs.slice(newLogs.length - 50);
            return newLogs;
        });
    }, []);

    const clearLogs = useCallback(() => {
        setLogs([]);
    }, []);

    return (
        <TerminalContext.Provider value={{ logs, addLog, clearLogs, systemStatus, setSystemStatus }}>
            {children}
        </TerminalContext.Provider>
    );
};

export const useTerminal = () => {
    const context = useContext(TerminalContext);
    if (context === undefined) {
        throw new Error('useTerminal must be used within a TerminalProvider');
    }
    return context;
};
