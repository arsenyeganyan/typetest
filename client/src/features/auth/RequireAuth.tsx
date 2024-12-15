import { Navigate, Outlet } from "react-router-dom";
import { useCheckAuthQuery } from "./authApiSlice";
import Cookies from "js-cookie";

const RequireAuth = () => {
  const {
    data,
    isLoading,
    isSuccess,
    isError,
  } = useCheckAuthQuery();

  let content;
  if (isLoading) {
    content = <p>"Loading..."</p>;
  } else if(isSuccess) {
    Cookies.set('userId', (data?.userId || ''), { sameSite: 'None' });
    content = <Outlet />;
  } else if(isError) {
    content =<Navigate to="/login" replace />;
  }

  return content;
}

export default RequireAuth;