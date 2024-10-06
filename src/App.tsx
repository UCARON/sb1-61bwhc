import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Trophy, PlusCircle, Database } from 'lucide-react'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const App: React.FC = () => {
  const [games, setGames] = useState<any[]>([])
  const [newGame, setNewGame] = useState({ name: '', score: '' })
  const [loading, setLoading] = useState(false)

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

  async function addGame(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase
      .from('games')
      .insert([{ name: newGame.name, score: parseInt(newGame.score) }])
    
    if (error) console.error('Error adding game:', error)
    else {
      setNewGame({ name: '', score: '' })
      fetchGames()
    }
  }

  async function addTestData() {
    setLoading(true)
    const testData = [
      { name: 'Super Mario Odyssey', score: 97 },
      { name: 'The Legend of Zelda: Breath of the Wild', score: 97 },
      { name: 'Red Dead Redemption 2', score: 97 },
      { name: 'Grand Theft Auto V', score: 97 },
      { name: 'God of War', score: 94 },
    ]

    const { error } = await supabase.from('games').insert(testData)
    
    if (error) console.error('Error adding test data:', error)
    else {
      fetchGames()
      alert('Test data added successfully!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-3xl font-bold flex items-center">
          <Trophy className="mr-2" /> Game Rankings
        </h1>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
          <form onSubmit={addGame} className="p-4 flex items-end space-x-4">
            <div>
              <label htmlFor="gameName" className="block text-sm font-medium text-gray-700">Game Name</label>
              <input
                type="text"
                id="gameName"
                value={newGame.name}
                onChange={(e) => setNewGame({...newGame, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <div>
              <label htmlFor="gameScore" className="block text-sm font-medium text-gray-700">Score</label>
              <input
                type="number"
                id="gameScore"
                value={newGame.score}
                onChange={(e) => setNewGame({...newGame, score: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
            </div>
            <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center">
              <PlusCircle className="mr-2" /> Add Game
            </button>
          </form>
        </div>
        <div className="mb-6">
          <button
            onClick={addTestData}
            disabled={loading}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Database className="mr-2" /> {loading ? 'Adding Test Data...' : 'Add Test Data'}
          </button>
        </div>
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
