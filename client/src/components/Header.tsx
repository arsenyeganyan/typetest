import '../css/home.css';
import { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useLogoutMutation, useGetSessionQuery } from '../features/auth/authApiSlice';

const Header = () => {
    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState('');
    const [logout] = useLogoutMutation();

    const { data: response } = useGetSessionQuery();

    const handleLogout = async (e: any) => {
        e.preventDefault();

        try {
            const userData = await logout({}).unwrap();
            console.log(userData);

            navigate('/login');
        } catch(err: any) {
            const status = err?.originalStatus || err?.status || err?.response?.status;
            
            setErrMsg(`Logout failed, status code: ${status}!`);
        }
    }

  return (
    <>
        <header>
            <p>ArsenType</p>
            <ul>
            <li>
                    <Link id='link' to='/'>Home</Link>
                </li>
                <li>
                    <Link id='link' to={`/dashboard/${response?.userId}`}>Personal</Link>
                </li>
                <li onClick={handleLogout}>Logout</li>
            </ul>
            {errMsg}
        </header>
        <Outlet />
    </>
  )
}

export default Header