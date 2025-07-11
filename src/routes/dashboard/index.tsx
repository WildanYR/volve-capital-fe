import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
  beforeLoad: () => {
    throw redirect({ to: '/dashboard/device' })
  },
})

function RouteComponent() {
  return <div>Nothing Here</div>
}
