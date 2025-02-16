'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ThumbsUp, ThumbsDown, MessageSquare, Send, Search } from 'lucide-react'
export default function PublicOpinionPage() {
  const [questions, setQuestions] = useState([])  // Replace static data with fetched data
  const [activeQuestion, setActiveQuestion] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [userVotes, setUserVotes] = useState({}) // Track user votes (either 'up' or 'down' per question)

  // Fetch public opinion data from the API
  useEffect(() => {
    fetch('https://asiafashion.com.bd/e-vote-version-3.0/public_opinion/fetch.php', {
      method: 'GET',
      credentials: 'include',  // To include credentials (cookies)
    })
      .then(response => response.json())
      .then(data => {
        setQuestions(data.public_opinions)

        // Track user votes by checking `user_reaction` in the fetched data
        const userVotesMap = data.public_opinions.reduce((acc, question) => {
          acc[question.public_opinion.p_o_id] = question.user_reaction || null
          return acc
        }, {})
        setUserVotes(userVotesMap)
      })
      .catch(error => console.error('Error fetching data:', error))
  }, [])

  useEffect(() => {
    const filtered = questions.filter(question =>
      (question.public_opinion.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
       question.public_opinion.created_by.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || question.public_opinion.status === statusFilter) &&
      (categoryFilter === 'all' || question.public_opinion.category === categoryFilter)
    )
    setQuestions(filtered)
  }, [searchTerm, statusFilter, categoryFilter])

  // Handle voting
  const handleVote = (questionId, voteType) => {
    // If the user already voted, prevent any further voting
    if (userVotes[questionId] && userVotes[questionId] === voteType) return; // Prevent re-voting the same type

    if (userVotes[questionId]) return; // Prevent voting if a vote has already been cast

    // Proceed with the vote if conditions allow
    const data = {
      p_o_id: questionId,
      react: voteType,  // 'up' or 'down'
      comment: null      // No comment for vote actions
    }

    fetch('https://asiafashion.com.bd/e-vote-version-3.0/public_opinion/create.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include',  // Include credentials with the request
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          // After a successful vote, update the user vote state
          setUserVotes(prev => ({ ...prev, [questionId]: voteType })) // Track user vote
          setQuestions(prevQuestions =>
            prevQuestions.map(q =>
              q.public_opinion.p_o_id === questionId
                ? {
                    ...q,
                    total_upvotes: voteType === 'up' ? q.total_upvotes + 1 : q.total_upvotes,
                    total_downvotes: voteType === 'down' ? q.total_downvotes + 1 : q.total_downvotes
                  }
                : q
            )
          )
        } else {
          console.error('Failed to submit vote')
        }
      })
      .catch(error => console.error('Error submitting vote:', error))
  }

  // Handle comment submission
  const handleComment = (questionId) => {
    if (newComment.trim()) {
      const data = {
        p_o_id: questionId,
        react: null,  // No vote
        comment: newComment // Add the comment
      }

      fetch('https://asiafashion.com.bd/e-vote-version-3.0/public_opinion/create.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include',  // Include credentials with the request
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            // Update the question state with the new comment
            setQuestions(prevQuestions =>
              prevQuestions.map(q =>
                q.public_opinion.p_o_id === questionId
                  ? {
                      ...q,
                      total_comments: q.total_comments + 1,
                      comments: [
                        ...q.comments,
                        { comment: newComment, user_name: 'You' } // Assuming 'You' is the current user
                      ]
                    }
                  : q
              )
            )
            setNewComment('')  // Clear the comment input field
          } else {
            console.error('Failed to submit comment')
          }
        })
        .catch(error => console.error('Error submitting comment:', error))
    }
  }

  const categories = Array.from(new Set(questions.map(q => q.public_opinion.category)))

  return (
    <div className="space-y-6">
  <div className="flex flex-col md:flex-row gap-4">
    <div className="relative flex-grow">
      <Input
        placeholder="Search questions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pl-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
    <Select value={statusFilter} onValueChange={setStatusFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        <SelectItem value="ongoing">Ongoing</SelectItem>
        <SelectItem value="past">Past</SelectItem>
      </SelectContent>
    </Select>
    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map(category => (
          <SelectItem key={category} value={category}>{category}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {questions.map((question) => (
      <motion.div
        key={question.public_opinion.p_o_id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col"
      >
        <Card className="flex flex-col h-auto">  {/* Set the height of the card to auto */}
          <CardHeader>
            <CardTitle>{question.public_opinion.question}</CardTitle>
            <div className="flex justify-between items-center">
              <Badge className={`${question.public_opinion.status === 'ongoing' ? 'bg-[#26db83] text-white' : 'bg-[#3ee6942a] text-[#26db83]'}`} variant={question.public_opinion.status === 'ongoing' ? 'default' : 'secondary'}>{question.public_opinion.status}</Badge>
              <Badge variant="outline">{question.public_opinion.category}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col min-h-0"> {/* Ensure content area does not stretch */}
            <p className="text-gray-600 mb-4">{question.public_opinion.description}</p>
            <div className="flex justify-between items-center mb-4">
              <Button
                variant={userVotes[question.public_opinion.p_o_id] === 'up' ? 'outline' : 'ghost'}
                onClick={() => handleVote(question.public_opinion.p_o_id, 'up')}
                className={userVotes[question.public_opinion.p_o_id] === 'up' ? 'border-primary' : ''}
                disabled={userVotes[question.public_opinion.p_o_id] === 'down'} // Disable upvote if downvoted
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                {question.total_upvotes}
              </Button>
              <Button
                variant={userVotes[question.public_opinion.p_o_id] === 'down' ? 'outline' : 'ghost'}
                onClick={() => handleVote(question.public_opinion.p_o_id, 'down')}
                className={userVotes[question.public_opinion.p_o_id] === 'down' ? 'border-primary' : ''}
                disabled={userVotes[question.public_opinion.p_o_id] === 'up'} // Disable downvote if upvoted
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                {question.total_downvotes}
              </Button>
              <Button variant="outline" onClick={() => setActiveQuestion(activeQuestion === question.public_opinion.p_o_id ? null : question.public_opinion.p_o_id)}>
                <MessageSquare className="w-4 h-4 mr-2" />
                {question.total_comments}
              </Button>
            </div>
            {activeQuestion === question.public_opinion.p_o_id && (
              <div className="space-y-4">
                {question.comments.map((comment, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${comment.user_name ? comment.user_name.charAt(0) : '?'}`} />
                      <AvatarFallback>{comment.user_name ? comment.user_name.charAt(0) : '?'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                      <p className="font-semibold">{comment.user_name}</p> {/* Display username */}
                      <p className="text-gray-600">{comment.comment}</p>
                    </div>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button onClick={() => handleComment(question.public_opinion.p_o_id)} className="bg-[rgb(38,219,131)] hover:bg-[rgb(38,219,131)]/90">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
</div>

  )
}
