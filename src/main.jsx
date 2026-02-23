import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './index.css'
import './css/admin_css/admin_layout.css'
import App from './App.jsx'

import Dashboard from './dashboard.jsx'
import Index2 from './user/index_test.jsx'
// import Dashboard from './user/dashboard_test.jsx'

import Login from "./user/login.jsx";
import Register from "./user/register.jsx";
import PrivateRoute from "./component/private_route.jsx";

//user

import Navbar from "./component/navbar.jsx";
import Footer from "./component/footer.jsx";
import SearchOverlay from "./component/search_overlay.jsx";

import HomePage from './user/index.jsx'
import AllStocks from './user/all_stocks.jsx'

import StockDetail from './user/stock_detail.jsx'
// import PriceTab from "./user/stock_detail/price_tab.jsx";
// import HistoryTab from "./user/stock_detail/history_tab.jsx";
// import FinanceTab from "./user/stock_detail/finance_tab.jsx";
// import HoldersTab from "./user/stock_detail/holders_tab.jsx";

import StockFuture from "./user/stock_future.jsx";
import Profile from "./user/profile.jsx";
import Portfolio from "./user/portfolio.jsx";
import AddInvestment from "./user/add_investment.jsx";
import EditProfile from "./user/edit_profile.jsx";
import EditInvestment from "./user/edit_investment";

import RiskIntro from "./user/risk_intro.jsx";
import RiskQuestions from "./user/risk_questions.jsx";
import RiskResult from "./user/risk_result.jsx";

// admin

import Sidebar from "./component/sidebar.jsx";
import Topbar from "./component/topbar.jsx";

import Overview from "./admin/overview.jsx";

import Users from "./admin/users.jsx";
import AddUser from "./admin/add_user.jsx";
import UserDetail from "./admin/user_detail.jsx";
import EditUser from "./admin/edit_user.jsx";

import Questions from "./admin/question.jsx";
import AddQuestion from "./admin/add_question.jsx";
import EditQuestion from "./admin/edit_question.jsx";

function UserLayout({ children }) {
  return (
    <>
      <Navbar />
      <div className="user-wrapper">
        {children}
      </div>
      <Footer />
    </>
  );
}

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />

      <div className="admin-main">
        <Topbar />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  //   <Index />
  // </StrictMode>,
  <BrowserRouter>

    <Routes>
      {/* <Route path="/kai" element={<Index />}></Route>
        <Route path="/" element={<Dashboard />}></Route> */}
      <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
      <Route path="/register" element={<UserLayout><Register /></UserLayout>} />

      {/* <Route path="/login" element={<PrivateRoute element={<UserLayout><Login /></UserLayout>} />} />
      <Route path="/register" element={<PrivateRoute element={<UserLayout><Register /></UserLayout>} />} /> */}

      {/* user */}

      <Route path="/" element={<UserLayout><HomePage /></UserLayout>} />
      <Route path="/stocks" element={<UserLayout><AllStocks /></UserLayout>} />
      <Route path="/:symbol/detail" element={<UserLayout><StockDetail /></UserLayout>} />
        {/*<Route index element={<PriceTab />} />
          <Route path="history" element={<HistoryTab />} />
          <Route path="finance" element={<FinanceTab />} />
          <Route path="holders" element={<HoldersTab />} />*/}
      <Route path="/detail/future" element={<UserLayout><StockFuture /></UserLayout>} />

      <Route path="/profile/:user_id" element={<UserLayout><Profile /></UserLayout>} />
      <Route path="/profile/edit/:user_id" element={<UserLayout><EditProfile /></UserLayout>} />

      <Route path="/portfolio" element={<UserLayout><Portfolio /></UserLayout>} />
      <Route path="/add-investment" element={<UserLayout><AddInvestment /></UserLayout>} />
      <Route path="/edit-investment" element={<UserLayout><EditInvestment /></UserLayout>} />

      <Route path="/risk" element={<UserLayout><RiskIntro /></UserLayout>} />
      <Route path="/risk-evaluation" element={<UserLayout><RiskQuestions /></UserLayout>} />
      <Route path="/risk-result" element={<UserLayout><RiskResult /></UserLayout>} />

      {/* admin */}

      <Route path="/admin/" element={<AdminLayout><Overview /></AdminLayout>} />

      <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
      <Route path="/admin/user/add" element={<AdminLayout><AddUser /></AdminLayout>} />
      <Route path="/admin/user/:user_id/detail" element={<AdminLayout><UserDetail /></AdminLayout>} />
      <Route path="/admin/user/:user_id/edit" element={<AdminLayout><EditUser /></AdminLayout>} />

      <Route path="/admin/question" element={<AdminLayout><Questions /></AdminLayout>} />
      <Route path="/admin/question/add" element={<AdminLayout><AddQuestion /></AdminLayout>} />
      <Route path="/admin/question/:question_id/edit" element={<AdminLayout><EditQuestion /></AdminLayout>} />
    </Routes>
  </BrowserRouter>
)
