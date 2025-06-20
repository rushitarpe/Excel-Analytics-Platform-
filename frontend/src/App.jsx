import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Pages/Header'
import SignupFrom from './Components/Auth/SignupFrom'
import SignInFrom from './Components/Auth/SignInFrom'
import Home from './Pages/Home'
import Footer from './Pages/Footer'
import Contact from './Pages/Contact'


const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Header />
      <Routes>

       
       <Route path="/sign-up" element={<SignupFrom />} />
       <Route path="/sign-in" element={<SignInFrom />} />
       <Route path="/" element={<Home />} />
       <Route path="/about" element={<About />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/dashboard" element={<Dashboard />} />
      
      </Routes>
      <Footer />
      
      </BrowserRouter>

    </div>
  )
}

export default App