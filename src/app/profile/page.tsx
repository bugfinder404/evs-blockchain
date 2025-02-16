import DashboardLayout from '@/components/DashboardLayout'
import ProfilePage from '@/components/profile'
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ProfilePage />
      {/* Your dashboard content goes here */}
    </DashboardLayout>
  )
}