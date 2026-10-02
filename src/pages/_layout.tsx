import { Outlet } from "react-router-dom"

interface LayoutProps {
  showHeader?: boolean;
}

export default function Layout({ showHeader: _ = false }: LayoutProps = {}) {
  return (
    <div className="h-dvh w-full flex flex-col overflow-hidden bg-background text-foreground">
      <main className="flex-1 flex overflow-hidden w-full">
        <Outlet />
      </main>
    </div>
  )
}