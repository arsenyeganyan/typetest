import '../css/home.css';
import { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useLogoutMutation } from '../features/auth/authApiSlice';
import Cookies from 'js-cookie';

const Header = () => {
    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState('');
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async (e: any) => {
        e.preventDefault();

        try {
            const userData = await logout({}).unwrap();
            Cookies.remove('userId');

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
                    <Link id='link' to='/dashboard'>Personal</Link>
                </li>
                <li>
                    <Link id='link' to='/global'>Leaderboard</Link>
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