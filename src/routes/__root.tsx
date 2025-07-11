import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner.tsx'
import { GlobalAlertDialogProvider } from '@/provider/alert-dialog.provider.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <GlobalAlertDialogProvider>
        <Outlet />
      </GlobalAlertDialogProvider>
      <Toaster richColors position="top-center" />

      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  ),
})
