// Plain data types for the architecture diagram (no React), so build tooling
// such as the route-meta step in vite.config.ts can import project data.
export interface TopologyNode {
    id: string;
    label: string;
    icon: string;
    x: number; // 0 to 100 percentage
    y: number; // 0 to 100 percentage
}

export interface TopologyEdge {
    from: string;
    to: string;
    label?: string;
    animated?: boolean;
}

export interface TopologyData {
    nodes: TopologyNode[];
    edges: TopologyEdge[];
}
