import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "@/app/page";
import LeftImageRightTextPage from "@/app/left-image-right-text/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/left-image-right-text" element={<LeftImageRightTextPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}