import { Outlet } from 'react-router-dom'

import { SectionMeter } from '@/components/SectionMeter'

const MainLayout = () => {
  return (
    <div className="flex min-h-dvh flex-col bg-transparent">
      <SectionMeter />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-red focus:px-4 focus:py-2 focus:text-white focus:shadow-md"
      >
        Skip to content
      </a>
      <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 focus:outline-none">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
