
import { userState } from "@/store/atom";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

const ProtectedRoutes = () => {
  const user = useRecoilValue(userState);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true })
    }
  }, [user, navigate]);

  return <Outlet />;
};
export default ProtectedRoutes