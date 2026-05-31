import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";

import Login from "./pages/Login.jsx";

import Register from "./pages/Register.jsx";

import Portfolio from "./pages/Portfolio.jsx";

import Market from "./pages/Market.jsx";

import Transactions from "./pages/Transactions.jsx";

import AdminMarket from "./pages/AdminMarket.jsx";

import Analytics from "./pages/Analytics.jsx";

import Profile from "./pages/Profile.jsx";

import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import PublicRoute from "./components/layout/PublicRoute.jsx";


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/market"
          element={
            <ProtectedRoute>
              <Market />
            </ProtectedRoute>
          }
        />

        <Route
          path="/portfolio"
          element={
            <ProtectedRoute>
              <Portfolio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/market"
          element={
            <ProtectedRoute role="admin">
              <AdminMarket />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
