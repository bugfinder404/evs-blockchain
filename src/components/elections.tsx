'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useWeb3 } from '@thirdweb-dev/react'; // Import Thirdweb's Web3 hook for MetaMask

// Define the interface for the fetched election data
interface Election {
  e_id: string;
  e_name: string;
  e_from_time: string;
  e_to_time: string;
  e_status: 'on' | 'off';
}

type ElectionStatus = 'Running' | 'Past' | 'Upcoming';

export default function ElectionPage() {
  const [elections, setElections] = useState<Election[]>([]);
  const [filter, setFilter] = useState<'all' | ElectionStatus>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const { connectWallet, address, disconnectWallet, contract } = useWeb3();
  const [isVoting, setIsVoting] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const router = useRouter();

  // Fetch the data from the provided API endpoint
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch('https://asiafashion.com.bd/e-vote-version-3.0/elections/fetch.php', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          const updatedElections = data.map((election: Election) => ({
            ...election,
            status: calculateElectionStatus(election.e_from_time, election.e_to_time),
          }));
          setElections(updatedElections);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching elections:', error);
        alert('Failed to fetch elections. Please try again later.');
      }
    };

    fetchElections();
  }, []);

  const calculateElectionStatus = (e_from_time: string, e_to_time: string): ElectionStatus => {
    const currentTime = new Date().getTime();
    const fromTime = new Date(e_from_time).getTime();
    const toTime = new Date(e_to_time).getTime();

    if (currentTime >= fromTime && currentTime <= toTime) {
      return 'Running';
    }
    if (toTime < currentTime) {
      return 'Past';
    }
    return 'Upcoming';
  };

  const filteredElections = elections.filter(election =>
    (filter === 'all' || election.status === filter) &&
    election.e_name.toLowerCase().includes(search.toLowerCase())
  );

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleCardClick = (electionId: string) => {
    router.push(`/elections/${electionId}`);
  };

  const handleWalletConnection = async () => {
    await connectWallet('injected');
  };

  useEffect(() => {
    if (address) {
      setIsWalletConnected(true);
    }
  }, [address]);

  const handleVote = async (electionId: string) => {
    if (!address) {
      alert('Please connect your wallet first!');
      return;
    }

    try {
      setIsVoting(true);
      const tx = await contract?.call('vote', [electionId]); // Interact with contract to vote
      await tx?.wait(); // Wait for the transaction to confirm
      setIsVoting(false);
      alert(`You voted successfully for election ${electionId}`);
    } catch (error) {
      setIsVoting(false);
      console.error('Vote Error:', error);
      alert('An error occurred while casting your vote.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search elections..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Elections</SelectItem>
              <SelectItem value="Running">Running</SelectItem>
              <SelectItem value="Past">Past</SelectItem>
              <SelectItem value="Upcoming">Upcoming</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('grid')}
            className={view === 'grid' ? 'bg-[#26db83] text-white' : ''}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setView('list')}
            className={view === 'list' ? 'bg-[#26db83] text-white' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isWalletConnected ? (
        <Button onClick={handleWalletConnection}>Connect Wallet</Button>
      ) : (
        <div>
          <p>Wallet Connected: {address}</p>
          <Button onClick={() => disconnectWallet()}>Disconnect</Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {view === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredElections.map((election) => (
              <motion.div
                key={election.e_id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Card
                  className="overflow-hidden cursor-pointer"
                  onClick={() => handleCardClick(election.e_id)}
                >
                  <CardHeader className="p-0">
                    <img src={election.e_img} alt={election.e_name} className="h-48 w-full object-cover" />
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg">{election.e_name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-2">
                      <Calendar className="inline-block w-4 h-4 mr-1" />
                      {new Date(election.e_from_time).toLocaleDateString()} - {new Date(election.e_to_time).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="bg-[#26db83]/10 p-4">
                    <p className="text-sm font-medium text-[#26db83] capitalize">
                      {election.status}
                    </p>
                    <Button
                      className="mt-2"
                      onClick={() => handleVote(election.e_id)}
                      disabled={isVoting}
                    >
                      {isVoting ? 'Voting...' : 'Vote'}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {filteredElections.map((election) => (
              <motion.div
                key={election.e_id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
              >
                <Card
                  className="cursor-pointer"
                  onClick={() => handleCardClick(election.e_id)}
                >
                  <div className="flex items-center">
                    <img src={election.e_img} alt={election.e_name} className="h-24 w-14 w-full object-cover" />
                    <div className="flex-grow p-4">
                      <CardTitle>{election.e_name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-2">
                        <Calendar className="inline-block w-4 h-4 mr-1" />
                        {new Date(election.e_from_time).toLocaleDateString()} - {new Date(election.e_to_time).toLocaleDateString()}
                      </p>
                    </div>
                    <CardFooter className="bg-[#26db83]/10 p-4 h-full flex items-center">
                      <p className="text-sm font-medium text-[#26db83] capitalize">
                        {election.status}
                      </p>
                      <Button
                        className="mt-2"
                        onClick={() => handleVote(election.e_id)}
                        disabled={isVoting}
                      >
                        {isVoting ? 'Voting...' : 'Vote'}
                      </Button>
                    </CardFooter>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
