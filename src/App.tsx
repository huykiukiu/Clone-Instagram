import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import PublicMiddleware from "./middlewares/PublicMiddleware";
export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<AuthMiddleware />}>
          <Route index element={<MainLayout />} />
        </Route>
        <Route element={<PublicMiddleware />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}
