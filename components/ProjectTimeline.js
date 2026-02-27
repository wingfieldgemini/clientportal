export default function ProjectTimeline({ milestones = [] }) {
  const getStatus = (milestone) => {
    if (milestone.completed) return 'completed'
    // First incomplete milestone = in progress
    const firstIncomplete = milestones.find(m => !m.completed)
    if (firstIncomplete && firstIncomplete.id === milestone.id) return 'in_progress'
    return 'pending'
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅'
      case 'in_progress': return '🔄'
      default: return '⏳'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in_progress': return 'text-wg-red bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'COMPLETED'
      case 'in_progress': return 'IN PROGRESS'
      default: return 'PENDING'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (milestones.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-2">📅</div>
        <p className="text-gray-600">No milestones have been created yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {milestones.map((milestone, index) => {
        const status = getStatus(milestone)
        return (
          <div key={milestone.id} className="flex items-start space-x-4">
            <div className="flex flex-col items-center">
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-xl
                ${status === 'in_progress' 
                  ? 'bg-wg-red text-white ring-4 ring-red-100' 
                  : status === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {getStatusIcon(status)}
              </div>
              
              {index < milestones.length - 1 && (
                <div className={`
                  w-0.5 h-16 mt-2
                  ${status === 'completed' ? 'bg-green-300' : 'bg-gray-300'}
                `} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className={`
                  text-lg font-semibold
                  ${status === 'in_progress' ? 'text-wg-red' : 'text-gray-900'}
                `}>
                  {milestone.name}
                </h3>
                
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  ${getStatusColor(status)}
                `}>
                  {getStatusLabel(status)}
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">{milestone.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📅 Due: {formatDate(milestone.due_date)}</span>
                {milestone.completed && milestone.completed_at && (
                  <span>✅ Completed: {formatDate(milestone.completed_at)}</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
