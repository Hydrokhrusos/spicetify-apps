import { deleteWorkflow } from 'custom-apps/playlist-maker/src/db/workflows/workflow-db';
import useDialogStore, {
    type DialogState,
} from 'custom-apps/playlist-maker/src/stores/dialog-store';
import React from 'react';
import { useShallow } from 'zustand/react/shallow';

export function ConfirmDeleteDialog(): JSX.Element {
    const {
        showConfirmDeleteModal,
        setShowConfirmDeleteModal,
        selectedWorkflow,
    }: Pick<
        DialogState,
        | 'showConfirmDeleteModal'
        | 'setShowConfirmDeleteModal'
        | 'selectedWorkflow'
    > = useDialogStore(
        useShallow((state) => {
            return {
                showConfirmDeleteModal: state.showConfirmDeleteModal,
                setShowConfirmDeleteModal: state.setShowConfirmDeleteModal,
                selectedWorkflow: state.selectedWorkflow,
            };
        }),
    );

    return (
        <Spicetify.ReactComponent.ConfirmDialog
            isOpen={showConfirmDeleteModal}
            onConfirm={async () => {
                setShowConfirmDeleteModal(false);
                if (selectedWorkflow !== null) {
                    await deleteWorkflow(selectedWorkflow.id);
                }
            }}
            onClose={() => {
                setShowConfirmDeleteModal(false);
            }}
            onOutside={() => {
                setShowConfirmDeleteModal(false);
            }}
            titleText="Delete workflow"
            descriptionText={`Are you sure you want to delete the workflow "${selectedWorkflow?.name ?? ''}" ?`}
            confirmText="Confirm"
            cancelText="Cancel"
        />
    );
}
