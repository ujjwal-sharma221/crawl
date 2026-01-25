import { Link } from '@tanstack/react-router'

import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className=" flex h-16 w-full   items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="logo" className="size-8" />
          <h1 className="text-lg font-semibold">Crawl</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/register">Sign Up</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Get Started</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
