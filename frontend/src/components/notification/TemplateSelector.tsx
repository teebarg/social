import type { NotificationTemplatePublic } from "@/client/models/notification.model"
import { NotificationsService } from "@/client/services/notification.service"
import AddTemplate from "@/components/notification/AddTemplate"
import EditTemplate from "@/components/notification/EditTemplate"
import { Button } from "@/components/ui/button"
import { Pencil, Plus, Trash } from "nui-react-icons"
import { useState } from "react"
import { useOverlayTriggerState } from "react-stately"
import { Confirm } from "../confirm"
import { Modal } from "../modal"

interface TemplateSelectorProps {
  templates: Array<NotificationTemplatePublic> | undefined
  onSelect: (template: NotificationTemplatePublic) => void
}

export function TemplateSelector({
  templates,
  onSelect,
}: TemplateSelectorProps) {
  const [addTemplate, setAddTemplate] = useState<boolean>(false)
  const [id, setId] = useState<string>("")
  const [template, setTemplate] = useState<any>(null)
  const confirmationModal = useOverlayTriggerState({})
  const slideOverState = useOverlayTriggerState({})

  const handleDelete = (id: string) => {
    setId(id)
    confirmationModal.open()
  }

  const handleEdit = (template: any) => {
    setTemplate(template)
    slideOverState.open()
  }

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-default-900">Templates</h3>
        <div>
          <Button
            color="primary"
            onClick={() => setAddTemplate(true)}
            className=""
          >
            Add <Plus />
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates?.map((template) => (
            <div
              key={template.id}
              onClick={() => onSelect(template)}
              className="relative rounded-lg border border-gray-300 bg-content1 px-6 py-5 shadow-sm flex flex-col items-start focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <div className="flex-1">
                <span className="text-2xl mb-2 block">{template.icon}</span>
                <h3 className="text-sm font-medium text-default-900">
                  {template.title}
                </h3>
                <p className="mt-1 text-sm text-default-500">
                  {template.excerpt}
                </p>
              </div>
              <div className="flex flex-row-reverse mt-4 gap-2 w-full">
                <Button
                  color="danger"
                  onClick={() => handleDelete(template.id as string)}
                  className="min-w-0"
                >
                  <Trash />
                </Button>
                <Button
                  color="secondary"
                  onClick={() => handleEdit(template)}
                  className="min-w-0"
                >
                  <Pencil />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddTemplate isOpen={addTemplate} onClose={() => setAddTemplate(false)} />
      {slideOverState.isOpen && (
        <Modal onClose={slideOverState.close}>
          <EditTemplate template={template} onClose={slideOverState.close} />
        </Modal>
      )}

      {confirmationModal.isOpen && (
        <Modal onClose={confirmationModal.close}>
          <Confirm
            title="Delete template?"
            content="Are you sure you want to delete this template? This action cannot be undone."
            onClose={confirmationModal.close}
            queryKey="templates"
            onConfirm={NotificationsService.deleteTemplate({ id: id })}
          />
        </Modal>
      )}
    </>
  )
}
