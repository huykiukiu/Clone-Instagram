import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import MainLayout from "./layouts/MainLayout";
import AuthMiddleware from "./middlewares/AuthMiddleware";
import PublicMiddleware from "./middlewares/PublicMiddleware";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ProfilePage from "./pages/ProfilePage";
import UserAllPost from "./pages/userProfilePage/UserAllPost";
import UserSavePost from "./pages/userProfilePage/UserSavePost";
import UserAllVideo from "./pages/userProfilePage/UserAllVideo";
import EditProfileForm from "./pages/userProfilePage/EditProfileForm";
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
            <Route path="profile" element={<EditProfileForm />} />
          </Route>
        </Route>
        <Route element={<PublicMiddleware />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
        </Route>
      </Routes>
    </div>
  );
}
