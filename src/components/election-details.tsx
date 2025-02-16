'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Users, Award, CheckCircle2 } from 'lucide-react';

const ElectionPage = () => {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [electionData, setElectionData] = useState(null);
  const [teamsData, setTeamsData] = useState([]);
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);  // New state to hold selected candidate
  const [progress, setProgress] = useState(0);
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [errors, setErrors] = useState({ overview: '', participate: '', results: '' });

  const electionId = params.e_id;

  // Random Profile Images Array
  const randomProfileImages = [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/men/4.jpg',
    'https://randomuser.me/api/portraits/men/5.jpg',
    'https://randomuser.me/api/portraits/men/6.jpg',
  ];

  // Function to get a random profile image
  const getRandomProfileImage = () => {
    const randomIndex = Math.floor(Math.random() * randomProfileImages.length);
    return randomProfileImages[randomIndex];
  };

  useEffect(() => {
    if (electionId) {
      const fetchElectionData = async () => {
        try {
          const overviewResponse = await fetch(`https://asiafashion.com.bd/e-vote-version-3.0/elections/overview/overview.php?e_id=${electionId}`, { credentials: 'include' });
          const overviewData = await overviewResponse.json();
  
          if (overviewData.error) {
            setErrors(prev => ({ ...prev, overview: overviewData.error }));
          } else {
            setElectionData(overviewData);
            setProgress(overviewData.vote_percentage || 0);
          }
  
          const teamsResponse = await fetch(`https://asiafashion.com.bd/e-vote-version-3.0/elections/overview/participate.php?e_id=${electionId}`, { credentials: 'include' });
          const teamsData = await teamsResponse.json();
  
          if (teamsData.error) {
            setErrors(prev => ({ ...prev, participate: teamsData.error }));
          } else {
            setTeamsData(teamsData);
          }
  
          const voteCheckResponse = await fetch(`https://asiafashion.com.bd/e-vote-version-3.0/elections/overview/participate.php?e_id=${electionId}`, { credentials: 'include' });
          const voteCheckData = await voteCheckResponse.json();
  
          if (voteCheckData.error === 'You have already voted in this election.') {
            setUserHasVoted(true);
          }
        } catch (error) {
          console.error('Error fetching election data:', error);
          setErrors(prev => ({
            ...prev,
            overview: 'Error fetching election data. Please try again later.',
            participate: 'Error fetching participation data. Please try again later.',
          }));
        }
      };
      fetchElectionData();
    }
  }, [electionId]);

  const handleVote = (teamId, candidateId) => {
    setSelectedTeam(teamId);
    setSelectedCandidate(candidateId);  // Save candidate ID
    setShowVoteConfirmation(true);
  };

  const confirmVote = async () => {
    if (!selectedTeam || !selectedCandidate) return;  // Ensure both team and candidate are selected
    try {
      const response = await fetch(`https://asiafashion.com.bd/e-vote-version-3.0/elections/overview/create_vote.php?e_id=${electionId}`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({
          candidate_id: selectedCandidate,  // Send candidate ID
          team_id: selectedTeam,             // Send selected team ID
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
  
      if (data.status === 'success') {
        setShowVoteConfirmation(false);
        router.push('/vote-success');
      } else {
        setErrors(prev => ({ ...prev, results: 'Error submitting vote. Please try again.' }));
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      setErrors(prev => ({ ...prev, results: 'Error submitting vote. Please try again.' }));
    }
  };
  
  const statsCards = [
    { title: 'Total Candidates', value: electionData?.candidate, icon: Users },
    { title: 'Total Nominees', value: electionData?.nominee, icon: Award },
    { title: 'Total Teams', value: electionData?.team, icon: Users },
    { title: 'Total Seats', value: electionData?.seats?.length, icon: CheckCircle2 },
    { title: 'Total Votes', value: electionData?.vote?.toLocaleString(), icon: CheckCircle2 },
    { title: 'Total Voters', value: electionData?.total_voters?.toLocaleString(), icon: Users },
  ];

  return (
    <div className="space-y-6">
      <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-[#26db83]">
        {electionData?.e_name || 'Loading Election...'}
      </motion.h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="voting">Voting</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          {errors.overview && <div className="error">{errors.overview}</div>}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {statsCards.map((card, index) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                <Card className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <card.icon className="h-6 w-6 text-[#26db83]" />
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-[#26db83]">{card.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.6 }} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Election Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={electionData?.percentage} className="w-full" />
                <p className="text-center mt-2">{electionData?.percentage}% of votes counted</p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Voting Tab */}
        <TabsContent value="voting">
          {errors.participate && <div className="error">{errors.participate}</div>}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamsData?.map((team, index) => (
              team.team && ( // Ensure we only map teams that exist
                <motion.div key={team.team.t_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="bg-gradient-to-r from-[#26db83] to-[#1fa76a] text-white">
                      <CardTitle className="flex items-center gap-2">
                        {/* Display team logo image */}
                        <img
                          src={team.team.t_logo}
                          alt={team.team.t_name}
                          className="h-10 w-10 rounded-full"
                        />
                        <img
                          src={team.team.t_symbol}
                          alt={team.team.t_name}
                          className="h-10 w-10 rounded-full"
                        />
                        {team.team.t_name}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4">
                      <p className="text-sm text-gray-600 italic mb-4">"{team.team.t_slogan}"</p>
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="font-semibold">Candidate</h3>
                          <div className="flex items-center gap-3">
                            {/* Display random candidate profile image */}
                            <img
                              src={getRandomProfileImage()} // Get random image for candidate
                              alt="Candidate"
                              className="h-10 w-10 rounded-full"
                            />
                            <p>{team.candidate?.n_id}</p> {/* Display the candidate's n_id */}
                          </div>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                      <Button variant="outline">View Details</Button>
                      <Button onClick={() => handleVote(team.team.t_id, team.candidate?.c_id)}>Give Vote</Button> {/* Pass the candidate ID */}
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            ))}
          </motion.div>
        </TabsContent>

        {/* Results Tab */}
        <TabsContent value="results">
          {errors.results && <div className="error">{errors.results}</div>}
          {/* Result content structure */}
        </TabsContent>
      </Tabs>

      {/* Confirm Vote Dialog */}
      <Dialog open={showVoteConfirmation} onOpenChange={setShowVoteConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Vote</DialogTitle>
            <DialogDescription>Are you sure you want to vote for {selectedTeam?.t_name}?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVoteConfirmation(false)}>Cancel</Button>
            <Button onClick={confirmVote}>Confirm Vote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ElectionPage;
