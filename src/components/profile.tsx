'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function ProfilePage() {
  const userInfo = {
    name: 'John Doe',
    username: 'johndoe123',
    email: 'john@example.com',
    nid: '1234567890',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, Anytown, AN 12345',
    joinDate: '2023-01-15',
  }

  const recentActivity = [
    { id: 1, action: 'Voted in Presidential Election 2024', date: '2024-11-03' },
    { id: 2, action: 'Commented on "Renewable Energy Investment"', date: '2024-10-28' },
    { id: 3, action: 'Upvoted "Four-day Work Week" topic', date: '2024-10-25' },
  ]

  return (
    <div className="space-y-6">
      {/* <h1 className="text-3xl font-bold text-[#26db83]">My Profile</h1> */}
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-center mb-4">
                <img
                  src="/placeholder.svg?height=100&width=100"
                  alt="Profile"
                  className="rounded-full w-24 h-24 border-4 border-[#26db83]"
                />
              </div>
              {Object.entries(userInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{new Date(activity.date).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline">Change Password</Button>
        <Button className="bg-[#26db83] hover:bg-[#26db83]/90">Update Profile</Button>
      </div>
    </div>
  )
}