import DashboardLayout from '@/components/DashboardLayout'
import SettingsPage from '@/components/settings'
import Chatbot from '@/components/chatbot'
export default function DashboardPage() {
  return (
    <DashboardLayout>
      <SettingsPage />
      <Chatbot />
      {/* Your dashboard content goes here */}
    </DashboardLayout>
  )
}