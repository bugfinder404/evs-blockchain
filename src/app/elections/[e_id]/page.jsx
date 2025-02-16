import DashboardLayout from '@/components/DashboardLayout'
import ElectionPage from '@/components/election-details'
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ElectionPage />
      {/* Your dashboard content goes here */}
    </DashboardLayout>
  )
}