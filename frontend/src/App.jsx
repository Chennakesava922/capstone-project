import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./stylings/App.module.css";

// Context
import { UserProvider } from "./context/UseContext";

// Auth
import Login from "./pages/Login";
import Signup from "./pages/UserSignup";


// Layouts
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

// User Components (nested under dashboard)
import UserProfile from "./pages/user/UserProfile";
import AllVehicles from "./pages/vehicle/AllVehicles";
import AddVehicle from "./pages/vehicle/AddVehicle";
import SearchVehicle from "./pages/vehicle/SearchVehicle";
import Policies from "./pages/policy/Policies";
import UserPolicies from "./pages/policy/UserPolicies";
import AvailablePolicies from "./pages/policy/AvailablePolicies";

import SubmitClaim from "./pages/claim/SubmitClaim";
import Payment from "./pages/payment/Payment";
import UserPaymentHistory from "./pages/payment/UserPaymentHistory";
import Claims from "./pages/claim/Claims";


// Admin Components (nested under admin dashboard)
import Users from "./pages/admin/Users";
import AdminPolicies from "./pages/admin/AdminPolicies";
import AdminPaymentHistory from "./pages/payment/AdminPaymentHistory";
import AdminClaims from "./pages/admin/AdminClaims";

// Public
import LandingPage from "./pages/LandingPage";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className={styles.appContainer}>
      <UserProvider>
        <Toaster/>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
           
            <Route path="/file-claim/:policyId" element={<SubmitClaim />} />

            {/* User Dashboard Routes */}
            <Route path="user" element={<UserDashboard />}>
              <Route path="profile" element={<UserProfile />} />
              <Route path="vehicles" element={<AllVehicles />} />
              <Route path="addVehicle" element={<AddVehicle />} />
              <Route path="searchVehicle" element={<SearchVehicle />} />
              <Route path="insurance policies" element={<AvailablePolicies/>}/>
              <Route path="policies" element={<UserPolicies />} />
              <Route path="policies/buy" element={<Policies />} />

              <Route path="payment/:policyId" element={<Payment />} />
              <Route path="payment-history" element={<UserPaymentHistory />} />
              <Route path="claims" element={<Claims />} />
              <Route path="claims/submit/:policyId" element={<SubmitClaim />} />
            </Route>

            {/* Admin Dashboard Routes */}
            <Route path="admin" element={<AdminDashboard />}>
              <Route path="profile" element={<UserProfile />} />
              <Route path="users" element={<Users />} />
              <Route path="policies" element={<AdminPolicies />} />
              <Route path="payment-history" element={<AdminPaymentHistory />} />
              <Route path="claims" element={<AdminClaims />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </div>
  );
};

export default App;