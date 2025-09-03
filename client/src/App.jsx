import React from 'react'
import Home from './Pages/Home.jsx'
import Register from './Pages/Register.jsx'
import Login from './Pages/login.jsx'
import Verify from './Pages/Verify.jsx'
import { Routes, Route } from 'react-router-dom';
import Profile from './Pages/Profile.jsx';
import NavBar from './Components/NavBar.jsx'
import Footer from './Components/Footer.jsx'
import Protected from './Components/Protected.jsx'
import AddText from './Pages/AddText.jsx'
import Texts from './Pages/Texts.jsx'
import TextId from './Pages/TextId.jsx'
import {LeaderBoard} from './Pages/LeaderBoard.jsx'
import ForgotPassword from './Pages/ForgotPassword.jsx'
import ResetPassword from './Pages/ResetPassword.jsx'
const App = () => {
  return (
    //  Add flexbox classes to this main div
    <div className="flex flex-col min-h-screen bg-gray-900" >
      <NavBar/>
      {/* Add the flex-grow class to the main content area */}
      <main className="flex-grow container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login/>} />
          <Route path='/texts' element ={<Texts/>}/>
          <Route path="/texts/:id" element={<TextId />} />
          <Route path = "/leaderboard" element ={<LeaderBoard/>}/>
          <Route path='/forgot-password' element = {<ForgotPassword/>}/>
          <Route path='/reset-password/:token' element = {<ResetPassword/>}/>

           <Route element={<Protected />}>
              <Route path="/profile" element={<Profile />} />
               <Route path='/add-text' element={<AddText/>}/>
            </Route>
          <Route path="/register" element={<Register />} />
          <Route path='/verify' element={<Verify/>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  )
}

export default App