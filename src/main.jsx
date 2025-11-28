import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Index from './admin/StockHome.jsx'
import Dashboard from './dashboard.jsx'
import { BrowserRouter, Routes, Route,Link } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <Index />
  // </StrictMode>,
  <BrowserRouter>
  <Routes>
    <Route path="/muk" element={<Index />}></Route>
    <Route path="/" element={<Dashboard />}></Route>
  </Routes>
</BrowserRouter>
)
w