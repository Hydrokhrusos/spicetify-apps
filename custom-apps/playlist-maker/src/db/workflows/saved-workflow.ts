import type { ReactFlowJsonObject } from 'reactflow';

export type SavedWorkflowMetadata = {
    /**
     * Workflow ID.
     */
    id: string;
    /**
     * Workflow name.
     */
    name: string;
    /**
     * Timestamp (in ms) when the workflow was last updated.
     */
    lastUpdated: number;
};

export type SavedWorkflow = ReactFlowJsonObject & SavedWorkflowMetadata;
