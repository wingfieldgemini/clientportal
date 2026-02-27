import { requireAuth, getClientData } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default async function DashboardLayout({ children }) {
  const user = await requireAuth()
  const clientData = await getClientData(user.id)

  if (!clientData) {
    return (
      <div className="min-h-screen bg-wg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400">Your account is not linked to a client profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wg-black flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} client={clientData.client} />
        <main className="flex-1 bg-wg-dark p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}