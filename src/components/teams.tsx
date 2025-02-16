'use client'

import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Team {
  t_id: number
  t_name: string
  t_slogan: string
  t_symbol: string
  t_logo: string
  t_details: string
  members: number
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  useEffect(() => {
    async function fetchTeams() {
      try {
        // Add credentials: 'include' to send cookies or authentication tokens
        const response = await fetch('https://asiafashion.com.bd/e-vote-version-3.0/teams/fetch.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Optionally, you can add Authorization headers here if needed
            // 'Authorization': 'Bearer <your-token>',
          },
          credentials: 'include', // Include credentials such as cookies or session
        })

        const data = await response.json()

        if (data.data) {
          const teamsWithMembers = data.data.map((team: any) => ({
            ...team,
            members: Math.floor(Math.random() * (3000 - 500 + 1)) + 500, // Random members
          }))
          setTeams(teamsWithMembers)
        } else {
          console.error('Error fetching teams:', data.message)
        }
      } catch (error) {
        console.error('Failed to fetch teams:', error)
      }
    }

    fetchTeams()
  }, [])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleViewDetails = (team: Team) => {
    setSelectedTeam(team)
  }

  const filteredTeams = teams.filter(team =>
    team.t_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search teams..."
          className="pl-8"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTeams.map((team) => (
          <Card key={team.t_id} className="overflow-hidden">
            <CardHeader className="bg-[#26db83]/10 p-4">
              <CardTitle className="flex items-center gap-2 text-xl">
              
              <img src={team.t_symbol} alt={team.t_name} className="h-12 w-12 rounded-md object-cover mr-2" />
              <img src={team.t_logo} alt={team.t_name} className="h-12 w-12 object-cover rounded-md" />
                {/* <span className="text-2xl">{team.t_symbo}</span> */}
                {team.t_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 italic mb-4">&quot;{team.t_slogan}&quot;</p>
              <p className="text-sm mb-4">{team.description}</p>
              <p className="text-sm text-gray-500">Members: {team.members.toLocaleString()}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full mt-4 bg-[#26db83] hover:bg-[#26db83]/90"
                    onClick={() => handleViewDetails(team)}
                  >
                    View Details
                  </Button>
                </DialogTrigger>
                {selectedTeam && selectedTeam.t_id === team.t_id && (
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>

                      <DialogTitle>{selectedTeam.t_name}</DialogTitle>
                      <DialogDescription>{selectedTeam.t_slogan}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                      <img
                      src={selectedTeam.t_symbol}
                      alt={selectedTeam.t_symbol}
                      className="h-36 w-36 object-cover"
                    />
                        {/* <span className="text-4xl col-span-1">{selectedTeam.t_symbol}</span> */}
                        <div className="col-span-3">
                          <p className="text-sm font-medium">Party Symbol</p>
                          <p className="text-sm text-gray-500">Official emblem</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium">Description</h4>
                        <p className="text-sm text-gray-600">{selectedTeam.t_details}</p>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium">Key Policies</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600">
                          <li>Policy 1</li>
                          <li>Policy 2</li>
                          <li>Policy 3</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium">Leadership</h4>
                        <p className="text-sm text-gray-600">Party Leader: John Doe</p>
                        <p className="text-sm text-gray-600">Deputy Leader: Jane Smith</p>
                      </div>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
