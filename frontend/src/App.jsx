import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketplace from "./pages/Marketplace";
import Dashboard from "./pages/Dashboard";
import ProductDetails from "./pages/ProductDetails";

import ProtectedRoute from "./components/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

 return (
  <Router>

   <Routes>

    <Route path="/" element={<Login />} />

    <Route path="/signup" element={<Signup />} />

    <Route
     path="/marketplace"
     element={
      <ProtectedRoute>
       <Marketplace />
      </ProtectedRoute>
     }
    />

    <Route
     path="/dashboard"
     element={
      <ProtectedRoute roleRequired="brand">
       <Dashboard />
      </ProtectedRoute>
     }
    />

    <Route
     path="/product/:id"
     element={
      <ProtectedRoute>
       <ProductDetails />
      </ProtectedRoute>
     }
    />

   </Routes>

   <ToastContainer position="top-right" />

  </Router>
 );
}

export default App;