import { useOverlayTriggerState } from "react-stately";

import DeleteConfirmation from "./DeleteConfirmation";
import { Button } from "../ui/button";
import { Modal } from "../modal";

const DeleteAccount = () => {
    const confirmationModal = useOverlayTriggerState({});

    return (
        <>
            <div>
                <h2 className="text-lg py-1">Delete Account</h2>
                <p>Permanently delete your data and everything associated with your account.</p>
                <Button className="mt-2" color="danger" onClick={confirmationModal.open}>
                    Delete
                </Button>
                {confirmationModal.isOpen && (
                    <Modal onClose={confirmationModal.close}>
                        <DeleteConfirmation onClose={confirmationModal.close} />
                    </Modal>
                )}
            </div>
        </>
    );
};
export default DeleteAccount;
