import { type WorkflowTrack } from '../../../types/workflow-track';
import { type BaseNodeData } from '../base-node-processor';
import { NodeProcessor } from '../node-processor';

export class SubstractProcessor extends NodeProcessor<BaseNodeData> {
    protected override getResultsInternal(
        inputByHandle: Record<string, WorkflowTrack[]>,
    ): Promise<WorkflowTrack[]> {
        const firstSetTracks = inputByHandle['first-set'] ?? [];
        const secondSetTracks = inputByHandle['second-set'] ?? [];

        const firstSet = new Set(firstSetTracks.map((track) => track.uri));
        const secondSet = new Set(secondSetTracks.map((track) => track.uri));

        // Relative complement
        const firstSetWithoutSecondSet = firstSet.difference(secondSet);

        const result = firstSetTracks.filter((track) =>
            firstSetWithoutSecondSet.has(track.uri),
        );

        return Promise.resolve(result);
    }
}
