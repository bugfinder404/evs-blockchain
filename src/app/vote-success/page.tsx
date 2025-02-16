import DashboardLayout from '@/components/DashboardLayout'
import VoteSuccessPage from '@/components/vote-success'
export default function DashboardPage() {
    return (
      <DashboardLayout>
        <VoteSuccessPage />
        {/* Your dashboard content goes here */}
      </DashboardLayout>
    )
  }