import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import InvitePage from './pages/InvitePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/invite" element={<InvitePage />} />
    </Routes>
  )
}

export default App
