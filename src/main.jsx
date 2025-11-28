import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Index from './admin/StockHome.jsx'
import Dashboard from './dashboard.jsx'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Index2 from './user/index_test.jsx'
// import Dashboard from './user/dashboard_test.jsx'

import Login from "./user/login.jsx";
import Register from "./user/register.jsx";

import Navbar from "./component/navbar.jsx";
import HomePage from './user/index.jsx'
import AllStocks from './user/all_stocks.jsx'

import StockDetail from './user/stock_detail.jsx'
import PriceTab from "./user/stock_detail/price_tab.jsx";
import HistoryTab from "./user/stock_detail/history_tab.jsx";
import FinanceTab from "./user/stock_detail/finance_tab.jsx";
import HoldersTab from "./user/stock_detail/holders_tab.jsx";

import StockFuture from "./user/stock_future.jsx";
import Profile from "./user/profile.jsx";
import Portfolio from "./user/portfolio.jsx";
import AddInvestment from "./user/add_investment.jsx";
import EditProfile from "./user/edit_profile.jsx";
import EditInvestment from "./user/edit_investment";
import RiskQuestions from "./user/risk_questions.jsx";
import RiskResult from "./user/risk_result.jsx";


createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <Index />
  // </StrictMode>,
  <BrowserRouter>

    <Navbar />
    <Routes>
      {/* <Route path="/kai" element={<Index />}></Route>
        <Route path="/" element={<Dashboard />}></Route> */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/" element={<HomePage />} />
      <Route path="/stocks" element={<AllStocks />} />
      <Route path="/detail" element={<StockDetail />}>
        {/*<Route index element={<PriceTab />} />
          <Route path="history" element={<HistoryTab />} />
          <Route path="finance" element={<FinanceTab />} />
          <Route path="holders" element={<HoldersTab />} />*/}
      </Route>
      <Route path="/detail/future" element={<StockFuture />} />


      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />


      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/add-investment" element={<AddInvestment />} />
      <Route path="/edit-investment" element={<EditInvestment />} />


      <Route path="/risk-evaluation" element={<RiskQuestions />} />
      <Route path="/risk-result" element={<RiskResult />} />

    </Routes>
  </BrowserRouter>
)
