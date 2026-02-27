export default function InvoiceCard({ invoice }) {
  const getStatusBadge = (status) => {
    const badges = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800'
    }
    
    return badges[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {invoice.description || `Invoice #${invoice.invoice_number}`}
              </h3>
              <p className="text-sm text-gray-600">
                Created: {formatDate(invoice.created_at)}
              </p>
              {invoice.due_date && (
                <p className="text-sm text-gray-600">
                  Due: {formatDate(invoice.due_date)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(invoice.amount)}
            </div>
            <span className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              ${getStatusBadge(invoice.status)}
            `}>
              {invoice.status.toUpperCase()}
            </span>
          </div>

          {invoice.status === 'pending' && (
            <div className="flex space-x-2">
              {invoice.payment_link && (
                <a
                  href={invoice.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-wg-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wg-red transition-colors"
                >
                  Pay Now
                </a>
              )}
              {invoice.pdf_url && (
                <a
                  href={invoice.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wg-red transition-colors"
                >
                  View PDF
                </a>
              )}
            </div>
          )}

          {invoice.status === 'paid' && invoice.pdf_url && (
            <a
              href={invoice.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-wg-red transition-colors"
            >
              View PDF
            </a>
          )}
        </div>
      </div>
    </div>
  )
}