import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Students from './pages/Students'
import StudentDetail from './pages/StudentDetail'
import Courses from './pages/Courses'
import Tests from './pages/Tests'
import Results from './pages/Results'
import Queries from './pages/Queries'
import TakeTest from './pages/TakeTest'
import Payments from './pages/Payments'
import About from './pages/About'
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/:id" element={<StudentDetail />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/results" element={<Results />} />
        <Route path="/queries" element={<Queries />} />
        <Route path="/tests/:id" element={<TakeTest />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}