import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import ReportIncident from "./pages/ReportIncident";
import MyReports from "./pages/MyReports";
import useAutoSync from "./hooks/useAutoSync";

export default function App() {
  useAutoSync();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportIncident />} />
          <Route path="/reports" element={<MyReports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}