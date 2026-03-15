import { BrowserRouter as Router, Routes, Route } from "react-router";
import Layout from "@/react-app/components/Layout";
import Dashboard from "@/react-app/pages/Dashboard";
import Analytics from "@/react-app/pages/Analytics";
import Profile from "@/react-app/pages/Profile";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </Router>
  );
}
