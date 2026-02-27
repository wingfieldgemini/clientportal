import { requireAuth, getClientData } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import DocumentCard from '@/components/DocumentCard'

async function getDocuments(clientId) {
  const supabase = createServerSupabaseClient()
  
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  
  return documents || []
}

export default async function DocumentsPage() {
  const user = await requireAuth()
  const clientData = await getClientData(user.id)
  const documents = await getDocuments(clientData.client_id)
  
  const contracts = documents.filter(d => d.category === 'contract')
  const proposals = documents.filter(d => d.category === 'proposal')
  const other = documents.filter(d => !['contract', 'proposal'].includes(d.category))
  
  const pendingReview = documents.filter(d => d.status === 'pending_review').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Documents</h1>
          <p className="text-gray-400 mt-2">View contracts, proposals, and project documents</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">All Documents</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold">{documents.length}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Contracts</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold">{contracts.length}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Proposals</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold">{proposals.length}</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Pending Review</h3>
          <div className="mt-2">
            <span className="text-3xl font-bold text-wg-red">{pendingReview}</span>
          </div>
        </div>
      </div>

      {/* Documents by Type */}
      {contracts.length > 0 && (
        <div className="bg-white rounded-lg p-6 text-black">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            📋 Contracts
          </h2>
          <div className="grid gap-4">
            {contracts.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      )}

      {proposals.length > 0 && (
        <div className="bg-white rounded-lg p-6 text-black">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            📝 Proposals
          </h2>
          <div className="grid gap-4">
            {proposals.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      )}

      {other.length > 0 && (
        <div className="bg-white rounded-lg p-6 text-black">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            📄 Other Documents
          </h2>
          <div className="grid gap-4">
            {other.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      )}

      {documents.length === 0 && (
        <div className="bg-white rounded-lg p-12 text-center text-black">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold mb-2">No Documents Yet</h3>
          <p className="text-gray-600">Project documents will appear here once available.</p>
        </div>
      )}
    </div>
  )
}