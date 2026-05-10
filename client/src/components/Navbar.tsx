import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'

const links = [
  { to: '/', label: '_home' },
  { to: '/reviews', label: '_reviews' },
  { to: '/recommendations', label: '_recommend' },
  { to: '/history', label: '_history' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-14">
        <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={closeMenu}>
          <span className="inline-block h-3 w-3 rounded-full bg-white group-hover:animate-pulse" />
          <span className="text-sm font-medium tracking-tight text-white">
            veloxcore
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
            {links.map((link) => {
              const isActive = pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-mono text-xs transition-colors px-2 sm:px-3 py-1.5 ${
                    isActive
                      ? 'text-white'
                      : 'text-neutral-600 hover:text-neutral-400'
                  }`}
                >
                  {link.label}
                  {isActive && <span className="ml-1.5 inline-block h-3 w-[1px] bg-white animate-pulse" />}
                </Link>
              )
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                <span className="font-mono text-xs text-neutral-600">{user.name}</span>
                <button
                  onClick={logout}
                  className="font-mono text-xs text-neutral-600 transition-colors hover:text-neutral-400"
                >
                  logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="font-mono text-xs border border-neutral-800 px-2.5 py-1.5 text-neutral-500 transition-colors hover:border-neutral-600 hover:text-neutral-300"
              >
                sign in
              </Link>
            )}
          </div>

          <a
            href="https://github.com/BANKOLEDO/veloxcore"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 border border-neutral-800 px-2.5 py-1.5 font-mono text-[11px] text-neutral-500 transition-colors hover:border-neutral-600 hover:text-neutral-300"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            Star
          </a>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="sm:hidden flex items-center justify-center p-1.5 text-neutral-500 hover:text-neutral-300 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-neutral-800 bg-neutral-950 px-4 py-4 space-y-3">
          <nav className="flex flex-col gap-1" aria-label="Main navigation">
            {links.map((link) => {
              const isActive = pathname === link.to
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMenu}
                  className={`font-mono text-sm transition-colors px-3 py-2 rounded ${
                    isActive
                      ? 'text-white bg-neutral-900'
                      : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {link.label}
                  {isActive && <span className="ml-2 inline-block h-3 w-[1px] bg-white animate-pulse" />}
                </Link>
              )
            })}
          </nav>

          <div className="pt-2 border-t border-neutral-800 space-y-2">
            <a
              href="https://github.com/BANKOLEDO/veloxcore"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center gap-2 font-mono text-xs text-neutral-500 hover:text-neutral-300 transition-colors px-3 py-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Star on GitHub
            </a>

            {user ? (
              <div className="space-y-2 px-3 py-2">
                <span className="block font-mono text-xs text-neutral-500">{user.name}</span>
                <button
                  onClick={() => { logout(); closeMenu() }}
                  className="font-mono text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="block font-mono text-xs text-neutral-500 hover:text-neutral-300 transition-colors px-3 py-2"
              >
                sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
