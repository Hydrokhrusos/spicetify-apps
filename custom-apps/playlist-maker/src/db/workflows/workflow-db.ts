import Dexie, { type EntityTable } from 'dexie';
import type { SavedLegacyWorkflow } from '../../utils/storage-utils';
import type { SavedWorkflow, SavedWorkflowMetadata } from './saved-workflow';

const dbName = 'playlist-maker:workflows';
const dbVersion = 1;

const workflowsDb = new Dexie(dbName) as Dexie & {
    workflows: EntityTable<SavedWorkflow, 'id'>;
};

workflowsDb.version(dbVersion).stores({
    workflows: '&id, name',
});

/**
 * Migrate legacy workflows from localStorage to indexedDB.
 * @param workflows Workflows to insert.
 */
export const insertLegacyWorkflows = async (
    workflows: SavedLegacyWorkflow[],
): Promise<void> => {
    const updatedWorkflows: SavedWorkflow[] = workflows.map((wf) => ({
        ...wf,
        lastUpdated: Date.now(),
    }));

    await workflowsDb.workflows.bulkAdd(updatedWorkflows);
};

/**
 * Get a filtered list of workflows sorted by name.
 * @param search The search term to filter workflows.
 * @returns A list of saved workflow metadata.
 */
export const getAllSorted = async (
    search: string,
): Promise<SavedWorkflowMetadata[]> => {
    const workflows = await workflowsDb.workflows
        .orderBy('name')
        .filter((workflow) => {
            return workflow.name.toLowerCase().includes(search.toLowerCase());
        })
        .toArray();

    return workflows.map((wf) => ({
        id: wf.id,
        name: wf.name,
        lastUpdated: wf.lastUpdated,
    }));
};

/**
 * Get a workflow by ID.
 * @param id The workflow ID.
 * @returns The saved workflow or undefined if not found.
 */
export const getWorkflow = async (
    id: string,
): Promise<SavedWorkflow | undefined> => {
    return await workflowsDb.workflows.get(id);
};

/**
 * Save or update a workflow.
 * @param workflow The workflow to save or update.
 */
export const saveOrUpdateWorkflow = async (
    workflow: SavedWorkflow,
): Promise<void> => {
    await workflowsDb.workflows.put(workflow);
};

/**
 * Delete a workflow by ID.
 * @param id The workflow ID to delete.
 */
export const deleteWorkflow = async (id: string): Promise<void> => {
    await workflowsDb.workflows.delete(id);
};
