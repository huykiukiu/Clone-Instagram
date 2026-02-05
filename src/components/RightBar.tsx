import Suggested from "./Suggested";
import UserInfor from "./user/UserInfor";

export default function RightBar() {
  return (
    <div className="w-80 h-fit">
      <UserInfor />
      <Suggested />
    </div>
  );
}
