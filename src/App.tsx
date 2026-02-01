import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import PublicMiddleware from "./middlewares/PublicMiddleware";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<AuthMiddleware />}>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
          </Route>
        </Route>
        <Route element={<PublicMiddleware />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}
