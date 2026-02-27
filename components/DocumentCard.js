export default function DocumentCard({ document }) {
  const getStatusBadge = (status) => {
    const badges = {
      signed: 'bg-green-100 text-green-800',
      pending_review: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800',
      pending_signature: 'bg-blue-100 text-blue-800'
    }
    
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type) => {
    const icons = {
      contract: '📋',
      proposal: '📝',
      invoice: '💰',
      agreement: '🤝',
      other: '📄'
    }
    
    return icons[type] || icons.other
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl">
            {getTypeIcon(document.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {document.name}
            </h3>
            
            {document.description && (
              <p className="text-gray-600 text-sm mb-2">
                {document.description}
              </p>
            )}
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>Created: {formatDate(document.created_at)}</span>
              <span className="capitalize">Type: {document.type}</span>
              {document.version && <span>v{document.version}</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className={`
            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
            ${getStatusBadge(document.status)}
          `}>
            {document.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex space-x-3">
        {document.url && (
          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wg-red transition-colors"
          >
            👁️ View
          </a>
        )}
        
        {document.download_url && (
          <a
            href={document.download_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wg-red transition-colors"
          >
            ⬇️ Download
          </a>
        )}
        
        {document.status === 'pending_signature' && document.signature_url && (
          <a
            href={document.signature_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-wg-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wg-red transition-colors"
          >
            ✍️ Sign Now
          </a>
        )}
      </div>
    </div>
  )
}