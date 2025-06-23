import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import Dashboard from "./components/Dashboard";
import LandingPage from "./pages/LandingPage";
import Welcome from "./components/Welcome";

// import Users from "./pages/Users";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LandingPage />} />

        {/* Admin route layout with nested routes */}
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<Welcome />} /> {/* 👈 Shows at /admin */}
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path="users" element={<Users />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}
