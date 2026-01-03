import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MedProvider, useMed } from "./context/MedContext.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Cabinet from "./pages/Cabinet/Cabinet.jsx";
import Vitals from "./pages/Vitals/Vitals.jsx";
import Auth from "./pages/Auth/Auth";
import { Toaster } from "react-hot-toast";

function App() {
  localStorage.removeItem("medivault_users");
  return (
    <MedProvider>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
    </MedProvider>
  );
}

function MainLayout() {
  const { state } = useMed();

  if (!state.user) {
    return <Auth />;
  }
  return (
    <>
      <Toaster
        // position="bottom-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/vitals" element={<Vitals />} />
          <Route
            path="/auth"
            element={state.user ? <Navigate to="/" replace /> : <Auth />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
