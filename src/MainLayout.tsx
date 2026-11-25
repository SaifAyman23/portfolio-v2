import { TextStrokeFilters } from '@/components/TextStrokeFilters'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-dvh flex-col">
      <TextStrokeFilters />
      {/* <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:shadow-md"
      >
        Skip to content
      </a> */}
      {/* <Navbar /> */}
      <div id="page-content" className="flex-1">
        {children}
      </div>
    </div>
  )
}

export default MainLayout
