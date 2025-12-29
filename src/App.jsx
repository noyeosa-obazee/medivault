import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MedProvider } from "./context/MedContext.jsx";
import Layout from "./components/Layout/Layout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Cabinet from "./pages/Cabinet/Cabinet.jsx";
import Vitals from "./pages/Vitals/Vitals.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <MedProvider>
      <BrowserRouter>
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
          </Route>
        </Routes>
      </BrowserRouter>
    </MedProvider>
  );
}

export default App;
