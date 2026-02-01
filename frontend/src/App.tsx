import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import QuestListPage from './pages/QuestListPage'
import DebugPage from './pages/DebugPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/quests" element={<QuestListPage />} />
        <Route path="/debug" element={<DebugPage />} />
      </Routes>
    </Router>
  )
}

export default App
