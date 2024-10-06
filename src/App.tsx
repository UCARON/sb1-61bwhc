import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Trophy } from 'lucide-react'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const App: React.FC = () => {
  const [games, setGames] = useState<any[]>([])

  useEffect(() => {
    fetchGames()
  }, [])

  async function fetchGames() {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('score', { ascending: false })
    
    if (error) console.error('Error fetching games:', error)
    else setGames(data || [])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="mr-2" /> Game Rankings
        </h1>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Rank</th>
                <th className="px-4 py-2">Game</th>
                <th className="px-4 py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game, index) => (
                <tr key={game.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2 text-center">{index + 1}</td>
                  <td className="px-4 py-2">{game.name}</td>
                  <td className="px-4 py-2 text-right">{game.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default App
