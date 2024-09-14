import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './component/Sidebar'
import Header from './component/Header'
import Language from './component/pages/Language'
import Category from './component/pages/Category'
import Post from './component/pages/post/Post'

function App() {

  return (
    <div>
      <Router>
        <div className='App'>
          <Sidebar />
        </div>
        <div className='content'>
          <Header></Header>
          <Routes>
            <Route path='/' element={<Language></Language>}></Route>
            <Route path='/category' element={<Category></Category>}></Route>
            <Route path='/post' element={<Post></Post>}></Route>
          </Routes>
        </div>
      </Router>
    </div >
  )
}

export default App
