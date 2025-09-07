
import { getDailyProfileVisits } from "../actions"
import { ProfileVisitsChart } from "./ProfileVisitsChart"

interface AnalyticsWrapperProps {
  userId: string 
}

export async function AnalyticsWrapper({ userId }: AnalyticsWrapperProps) {
  const dailyVisits = await getDailyProfileVisits(userId, 30)

  return <ProfileVisitsChart data={dailyVisits} />
}