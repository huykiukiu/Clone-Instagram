import { useNavigate } from "react-router-dom";
import Suggested from "./Suggested";
import UserInfor from "./user/UserInfor";

export default function RightBar() {
  const navigate = useNavigate();
  return (
    <div className="w-80 h-fit">
      <UserInfor />
      <Suggested />
    </div>
  );
}
