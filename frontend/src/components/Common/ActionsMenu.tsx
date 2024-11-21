import Dropdown from "@/components/ui/dropdown"
import { cn } from "@/utils"
import { EllipsisHorizontal, PencilSquare, Trash } from "nui-react-icons"
import { useOverlayTriggerState } from "react-stately"
import type { ItemPublic, UserPublic } from "../../client"
import EditUser from "../Admin/EditUser"
import EditItem from "../Items/EditItem"
import { Modal } from "../modal"
import Delete from "./DeleteAlert"

interface ActionsMenuProps {
  type: string
  value: ItemPublic | UserPublic
  disabled?: boolean
}

const ActionsMenu = ({ type, value }: ActionsMenuProps) => {
  const editUserModal = useOverlayTriggerState({})
  const deleteModal = useOverlayTriggerState({})

  return (
    <>
      <Dropdown align="end" trigger={<EllipsisHorizontal />}>
        <div>
          <div className="bg-default-100 rounded-lg shadow-md p-3 min-w-[100px] text-sm font-medium">
            <div className="mb-2">
              <button
                className="flex w-full items-center"
                onClick={editUserModal.open}
              >
                <span className="mr-2">
                  <PencilSquare />
                </span>
                <span>Edit</span>
              </button>
            </div>
            <div>
              <button
                className={cn("flex w-full items-center text-rose-500")}
                onClick={deleteModal.open}
              >
                <span className="mr-2">
                  <Trash />
                </span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </Dropdown>
      {type === "User" ? (
        <EditUser
          user={value as UserPublic}
          isOpen={editUserModal.isOpen}
          onClose={editUserModal.close}
        />
      ) : (
        <EditItem
          item={value as ItemPublic}
          isOpen={editUserModal.isOpen}
          onClose={editUserModal.close}
        />
      )}
      {deleteModal.isOpen && (
        <Modal onClose={deleteModal.close}>
          <Delete
            type={type}
            id={value.id}
            isOpen={deleteModal.isOpen}
            onClose={deleteModal.close}
          />
        </Modal>
      )}
      {/* <Menu>
                <MenuButton isDisabled={disabled} as={Button} rightIcon={<BsThreeDotsVertical />} variant="unstyled" />
                <MenuList>
                    <MenuItem onClick={editUserModal.onOpen} icon={<FiEdit fontSize="16px" />}>
                        Edit {type}
                    </MenuItem>
                    <MenuItem onClick={deleteModal.onOpen} icon={<FiTrash fontSize="16px" />} color="ui.danger">
                        Delete {type}
                    </MenuItem>
                </MenuList>
                {type === "User" ? (
                    <EditUser user={value as UserPublic} isOpen={editUserModal.isOpen} onClose={editUserModal.onClose} />
                ) : (
                    <EditItem item={value as ItemPublic} isOpen={editUserModal.isOpen} onClose={editUserModal.onClose} />
                )}
                <Delete type={type} id={value.id} isOpen={deleteModal.isOpen} onClose={deleteModal.onClose} />
            </Menu> */}
    </>
  )
}

export default ActionsMenu
