'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'Project', href: '/dashboard/project', icon: '📊' },
  { name: 'Invoices', href: '/dashboard/invoices', icon: '💰' },
  { name: 'Documents', href: '/dashboard/documents', icon: '📄' },
  { name: 'Messages', href: '/dashboard/messages', icon: '💬' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-wg-black w-64 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">WingfieldGemini</h1>
        <p className="text-gray-400 text-sm mt-1">Client Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${isActive 
                  ? 'bg-wg-red text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-gray-800">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <span className="text-lg mr-3">🚪</span>
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}