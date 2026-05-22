import { CommandMenu, LanguageSwitcher, ThemeToggle } from "@/components/molecules"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export const DashboardHeader = () => {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[variant=inset]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
      </div>

      {/* Căn giữa thanh search */}
      <div className="flex-1 px-4 max-w-3xl">
        <CommandMenu />
      </div>

      {/* Các công cụ góc phải */}
      <div className="flex items-center gap-2 ml-auto">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
    </header>
  )
}
