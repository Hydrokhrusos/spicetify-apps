import { getPlatform } from '@shared/utils/spicetify-utils';
import { z } from 'zod';
import { type WorkflowTrack } from '../../../types/workflow-track';
import { BaseNodeDataSchema } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export const IsSavedDataSchema = z
    .object({
        isSaved: z.boolean(),
    })
    .merge(BaseNodeDataSchema)
    .strict();

export type IsSavedData = z.infer<typeof IsSavedDataSchema>;

export const DEFAULT_IS_SAVED_DATA: IsSavedData = {
    isSaved: false,
    isExecuting: undefined,
};

export class IsSavedProcessor extends NodeProcessor<IsSavedData> {
    protected override async getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const input = inputByHandle['source'] ?? [];

        const { isSaved } = this.data;

        const libraryApi = getPlatform().LibraryAPI;

        const saved = await libraryApi.contains(
            ...input.map((track) => track.uri),
        );

        const filtered = input.filter((_, index) => saved[index] === isSaved);

        return Promise.resolve(filtered);
    }
}
