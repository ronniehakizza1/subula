import { Routes, Route } from "react-router-dom";
import "./App.css";
import Shop from "./pages/Shop";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import ProtectedRoute from "./pages/ProtectedRoute";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import PastOrders from "./pages/PastOrders";
import Landing from "./pages/Landing";

function App() {
  return (
    <div>
      <div>
        <UserAuthContextProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes - Only Accessible when loggedin */}
            <Route
              path="/shop"
              element={
                <ProtectedRoute>
                  <Shop />
                </ProtectedRoute>
              }
            />
            <Route
              path="/past-orders"
              element={
                <ProtectedRoute>
                  <PastOrders />
                </ProtectedRoute>
              }
            />
          </Routes>
        </UserAuthContextProvider>
      </div>
    </div>
  );
}

export default App;
