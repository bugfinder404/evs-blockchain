import DashboardLayout from '@/components/DashboardLayout'
import PublicOpinionPage from '@/components/public-opinion'
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PublicOpinionPage />
      {/* Your dashboard content goes here */}
    </DashboardLayout>
  )
}