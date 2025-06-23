import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/store/products')({
  component: () => <div>Hello /_layout/store/products!</div>
})