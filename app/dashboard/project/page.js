import { requireAuth, getClientData } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import ProjectTimeline from '@/components/ProjectTimeline'

async function getProjectData(clientId) {
  const supabase = createServerSupabaseClient()
  
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', clientId)
    .single()
  
  const { data: milestones } = await supabase
    .from('milestones')
    .select('*')
    .eq('project_id', project?.id)
    .order('sort_order', { ascending: true })
  
  return {
    project,
    milestones: milestones || []
  }
}

export default async function ProjectPage() {
  const user = await requireAuth()
  const clientData = await getClientData(user.id)
  const projectData = await getProjectData(clientData.client_id)
  
  if (!projectData.project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-white mb-4">No Project Found</h1>
        <p className="text-gray-400">No project has been created for your account yet.</p>
      </div>
    )
  }
  
  const completedMilestones = projectData.milestones.filter(m => m.completed)
  const totalMilestones = projectData.milestones.length
  const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones.length / totalMilestones) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 text-black">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{projectData.project.name}</h1>
            {projectData.project.notes && (
              <p className="text-gray-600 mt-2">{projectData.project.notes}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-wg-red">{progressPercentage}%</div>
            <div className="text-sm text-gray-600">Complete</div>
          </div>
        </div>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span>{completedMilestones.length} of {totalMilestones} milestones</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-wg-red h-3 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 text-black">
        <h2 className="text-2xl font-bold mb-6">Project Timeline</h2>
        <ProjectTimeline milestones={projectData.milestones} />
      </div>
    </div>
  )
}
