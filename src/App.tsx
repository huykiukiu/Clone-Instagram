import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import PublicMiddleware from "./middlewares/PublicMiddleware";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ProfilePage from "./pages/ProfilePage";
import { User } from "lucide-react";
import UserAllPost from "./pages/userProfilePage/UserAllPost";
import UserSavePost from "./pages/userProfilePage/UserSavePost";
import UserAllVideo from "./pages/userProfilePage/UserAllVideo";
export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<AuthMiddleware />}>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
            <Route path="user/:id" element={<ProfilePage />}>
              <Route index element={<UserAllPost />} />
              <Route path="saved" element={<UserSavePost />} />
              <Route path="videos" element={<UserAllVideo />} />
            </Route>
          </Route>
        </Route>
        <Route element={<PublicMiddleware />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}
