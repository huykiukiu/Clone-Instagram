import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import AuthMiddleware from "./middlewares/authMiddleware";
export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<AuthMiddleware />}>
          <Route index element={<MainLayout />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}
