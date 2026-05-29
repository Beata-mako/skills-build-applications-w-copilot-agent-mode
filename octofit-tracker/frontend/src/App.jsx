import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'
import './App.css'

function App() {
  const navItems = [
    { path: '/activities', label: 'Activities' },
    { path: '/leaderboard', label: 'Leaderboard' },
    { path: '/teams', label: 'Teams' },
    { path: '/users', label: 'Users' },
    { path: '/workouts', label: 'Workouts' },
  ]

  return (
    <main className="container py-4">
      <header className="mb-4">
        <h1 className="mb-3">Octofit Tracker</h1>
        <p className="text-muted mb-3">Monitor activities, teams, users, workouts, and rankings.</p>
        <nav className="nav nav-pills gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : 'border border-secondary-subtle'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <section>
        <Routes>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/activities" replace />} />
        </Routes>
      </section>
    </main>
  )
}

export default App
