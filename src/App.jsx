import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import RequireAdmin from './components/RequireAdmin'
import Home from './pages/Home'
import Students from './pages/Students'
import StudentDetail from './pages/StudentDetail'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Tests from './pages/Tests'
import TakeTest from './pages/TakeTest'
import Results from './pages/Results'
import Queries from './pages/Queries'
import Payments from './pages/Payments'
import Attendance from './pages/Attendance'
import About from './pages/About'
import Reports from './pages/Reports'
import Faculty from './pages/Faculty'
import Materials from './pages/Materials'
import ResultDetail from './pages/ResultDetail'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/tests/:id" element={<TakeTest />} />
        <Route path="/results" element={<Results />} />
        <Route path="/queries" element={<Queries />} />
        <Route path="/about" element={<About />} />
        <Route path="/payments" element={<RequireAdmin><Payments /></RequireAdmin>} />
        <Route path="/attendance" element={<RequireAdmin><Attendance /></RequireAdmin>} />
        <Route path="/reports" element={<RequireAdmin><Reports /></RequireAdmin>} />
        <Route path="/faculty" element={<Faculty />} />
        <Route path="/materials" element={<Materials />} />
        <Route path="/results/:id" element={<ResultDetail />} />
      </Route>
    </Routes>
  )
}