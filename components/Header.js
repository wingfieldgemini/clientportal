export default function Header({ user, client }) {
  return (
    <header className="bg-wg-black border-b border-gray-800 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {client?.business_name || 'Client Portal'}
          </h2>
          {client?.contact_person && (
            <p className="text-sm text-gray-400">
              Welcome, {client.contact_person}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm font-medium text-white">
              {user?.email}
            </p>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}