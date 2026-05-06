import { useNodeForm } from 'custom-apps/playlist-maker/src/hooks/use-node-form';
import { getDefaultValueForNodeType } from 'custom-apps/playlist-maker/src/utils/node-utils';
import React from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { CheckboxController } from '../../inputs/CheckboxController';
import { Node } from '../shared/Node';
import { NodeCheckboxField } from '../shared/NodeCheckboxField';
import { NodeContent } from '../shared/NodeContent';
import { FilterNodeHeader } from '../shared/NodeHeader';
import { NodeTitle } from '../shared/NodeTitle';
import {
    type IsSavedData,
    IsSavedDataSchema,
} from 'custom-apps/playlist-maker/src/models/processors/filter/is-saved-processor';

export function IsSavedNode(
    props: Readonly<NodeProps<IsSavedData>>,
): JSX.Element {
    const { control, updateNodeField, errors } = useNodeForm<IsSavedData>(
        props.id,
        props.data,
        getDefaultValueForNodeType('isSaved'),
        IsSavedDataSchema,
    );

    return (
        <Node isExecuting={props.data.isExecuting} isSelected={props.selected}>
            <FilterNodeHeader />
            <NodeContent>
                <NodeTitle title="Is saved" />

                <NodeCheckboxField label="Is saved ?" error={errors.isSaved}>
                    <CheckboxController
                        control={control}
                        name="isSaved"
                        onChange={(value) => {
                            updateNodeField({ isSaved: value });
                        }}
                    />
                </NodeCheckboxField>
            </NodeContent>
            <Handle
                type="target"
                position={Position.Left}
                style={{ top: '42px' }}
            />
            <Handle
                type="source"
                position={Position.Right}
                style={{ top: '42px' }}
            />
        </Node>
    );
}
