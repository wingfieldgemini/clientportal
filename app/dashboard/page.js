import { requireAuth, getClientData } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'

async function getDashboardData(clientId) {
  const supabase = createServerSupabaseClient()
  
  // Get project data
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .single()
  
  // Get milestones
  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', project?.id)
    .order('due_date', { ascending: true })
  
  // Get invoices
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientId)
  
  // Get documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientId)
  
  // Get unread messages
  const { data: unreadMessages } = await supabase
    .from('messages')
    .select('*')
    .eq('client_id', clientId)
    .eq('read', false)
    .eq('sender_type', 'team')
  
  return {
    project,
    milestones: milestones || [],
    invoices: invoices || [],
    documents: documents || [],
    unreadMessages: unreadMessages || []
  }
}

export default async function DashboardPage() {
  const user = await requireAuth()
  const clientData = await getClientData(user.id)
  const dashboardData = await getDashboardData(clientData.client_id)
  
  const currentMilestone = dashboardData.milestones.find(m => m.status === 'in_progress')
  const completedMilestones = dashboardData.milestones.filter(m => m.status === 'completed')
  const progressPercentage = Math.round((completedMilestones.length / dashboardData.milestones.length) * 100) || 0
  
  const paidInvoices = dashboardData.invoices.filter(i => i.status === 'paid').length
  const pendingInvoices = dashboardData.invoices.filter(i => i.status === 'pending').length
  const documentsToReview = dashboardData.documents.filter(d => d.status === 'pending_review').length

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {clientData.client.business_name}
        </h1>
        <p className="text-gray-400 mt-2">
          Here's your project overview and latest updates
        </p>
      </div>

      {/* Project Status Card */}
      {dashboardData.project && (
        <div className="bg-white rounded-lg p-6 text-black">
          <h2 className="text-xl font-semibold mb-4">Project Status</h2>
          
          {currentMilestone && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Current Milestone: {currentMilestone.name}</span>
                <span className="text-wg-red font-bold">{progressPercentage}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-wg-red h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              {currentMilestone.due_date && (
                <p className="text-sm text-gray-600 mt-2">
                  Due: {new Date(currentMilestone.due_date).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Invoices</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold">{paidInvoices}</span>
            <span className="text-gray-500"> paid</span>
            {pendingInvoices > 0 && (
              <>
                <span className="mx-2">•</span>
                <span className="text-wg-red font-semibold">{pendingInvoices} pending</span>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Documents</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold">{dashboardData.documents.length}</span>
            <span className="text-gray-500"> total</span>
            {documentsToReview > 0 && (
              <>
                <span className="mx-2">•</span>
                <span className="text-wg-red font-semibold">{documentsToReview} to review</span>
              </>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 text-black">
          <h3 className="font-semibold text-gray-600 text-sm uppercase tracking-wide">Messages</h3>
          <div className="mt-2">
            <span className="text-2xl font-bold">{dashboardData.unreadMessages.length}</span>
            <span className="text-gray-500"> unread</span>
          </div>
        </div>
      </div>

      {/* Next Milestone */}
      {currentMilestone && (
        <div className="bg-white rounded-lg p-6 text-black">
          <h2 className="text-xl font-semibold mb-4">Up Next</h2>
          <div className="border-l-4 border-wg-red pl-4">
            <h3 className="font-semibold">{currentMilestone.name}</h3>
            <p className="text-gray-600 mt-1">{currentMilestone.description}</p>
            {currentMilestone.due_date && (
              <p className="text-sm text-gray-500 mt-2">
                Due {new Date(currentMilestone.due_date).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}