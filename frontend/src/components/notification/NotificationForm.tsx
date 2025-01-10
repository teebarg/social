import type { NotificationPreview } from "@/client/models/notification.model"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Item, Select } from "@/components/ui/select1"
import { Textarea } from "@/components/ui/textarea"
import { Eye } from "nui-react-icons"
import { useState } from "react"

interface NotificationFormProps {
  onPreview: (preview: NotificationPreview) => void
}

export function NotificationForm({ onPreview }: NotificationFormProps) {
  const [title, setTitle] = useState<string>("")
  const [body, setBody] = useState("")
  const [icon, setIcon] = useState("")
  const [value, setValue] = useState<string>("")

  const handlePreview = () => {
    onPreview({ title, body, icon })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            className="mt-1 shadow-sm sm:text-sm"
            placeholder="Notification Title"
          />
        </div>
        <div>
          <Label htmlFor="icon">Icon (emoji or URL)</Label>
          <Input
            type="text"
            id="icon"
            value={icon}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIcon(e.target.value)
            }
            className="mt-1"
            placeholder="🔔"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="body">Message</Label>
        <Textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-1"
          placeholder="Notification message..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div>
          <Select
            label="Select Group"
            items={[]}
            selectedKey={value}
            onSelectionChange={(selected) => setValue(selected as string)}
            className="w-full"
          >
            {(item) => <Item key={item.value}>{item.label}</Item>}
          </Select>
        </div>
      </div>

      <div className="flex">
        <Button
          className="min-w-24"
          color="primary"
          onClick={handlePreview}
          startContent={<Eye className="h-4 w-4" />}
        >
          Preview
        </Button>
      </div>
    </div>
  )
}
