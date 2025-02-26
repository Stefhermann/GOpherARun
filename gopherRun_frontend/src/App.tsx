import { useState } from 'react'
//import './App.css' 
import {
  BrowserRouter as Router,
  Routes, Route, Link,
  useParams,
  useNavigate,
  useMatch,
  Navigate
} from 'react-router-dom'
import LandingPage from './components/LandingPage'
import CreatePage from './components/CreatePage'
import RunFeed from './components/RunFeed'
import UserPage from './components/UserPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <div>
        <h2>
          GopherARun!
        </h2>
        <div>
          <Link to="/">Landing/Home </Link>
          <Link to="/create">Event Creation </Link>
          <Link to="/feed">Run feed </Link>
          <Link to="/user">Login/Sign-up </Link>
        </div>
        <Routes>
          <Route path="/" element={<LandingPage/>} />
          <Route path="/create" element={<CreatePage/>} />
          <Route path="/feed" element={<RunFeed/>} />
          <Route path="/user" element={<UserPage/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
