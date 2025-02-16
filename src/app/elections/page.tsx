import DashboardLayout from '@/components/DashboardLayout'
import ElectionsPage from '@/components/elections'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ElectionsPage />
      {/* Your dashboard content goes here */}
    </DashboardLayout>
  )
}