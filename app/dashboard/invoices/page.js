import { requireAuth, getClientData } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import InvoiceCard from '@/components/InvoiceCard'

async function getInvoices(clientId) {
  const supabase = createServerSupabaseClient()
  
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  
  return invoices || []
}

export default async function InvoicesPage() {
  const user = await requireAuth()
  const clientData = await getClientData(user.id)
  const invoices = await getInvoices(clientData.client_id)
  
  const paidTotal = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + (i.amount || 0), 0)
  
  const pendingTotal = invoices
    .filter(i => i.status === 'pending')
    .reduce((sum, i) => sum + (i.amount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="text-gray-400 mt-2">View and manage your invoices</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Total Paid</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-green-600">
              ${paidTotal.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Pending</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-yellow-600">
              ${pendingTotal.toLocaleString()}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Total Invoices</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold">{invoices.length}</span>
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-lg overflow-hidden">
        {invoices.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <InvoiceCard key={invoice.id} invoice={invoice} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Invoices Yet</h3>
            <p className="text-gray-600">Invoices will appear here once your project begins.</p>
          </div>
        )}
      </div>
    </div>
  )
}