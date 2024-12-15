import '../../css/auth.css';
import { useRef, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLoginMutation } from "./authApiSlice";

const Login = () => {
  const navigate = useNavigate();

  const userRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef?.current?.focus();
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      const userData = await login({ username, password }).unwrap();
      setErrMsg(userData?.msg);
      
      navigate('/');
    } catch(err: any) {
      const status = err?.originalStatus || err?.status || err?.response?.status;

      if (status === 401) {
        setErrMsg('Unauthorized!');
      } else {
        setErrMsg('Login Failed!');
      }
    }
  }

  const handleUserInput = (e: any) => setUsername(e.target.value);
  const handlePwdInput = (e: any) => setPassword(e.target.value);

  const content = isLoading ? <h1>Loading...</h1> : (
    <div className='auth--container'>
        <h1>Log in</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="inputUserName" >Username</label>
                <input onChange={handleUserInput} ref={userRef} type="text" name="username" id="inputUserName"/>
            </div>
            <div>
                <label htmlFor="exampleInputPassword1">Password</label>
                <input onChange={handlePwdInput} type="password" name="password" id="exampleInputPassword1" />
            </div>
            {errMsg && (<p className={errMsg} aria-live="assertive">{errMsg}</p>)}
            <button type="submit">Submit</button>
        </form>
        <div className='reg'>
          <p>Have no account yet?</p>
          <Link id='link' to='/signup'>Sign up</Link>
        </div>
    </div>
  )

  return content;
}

export default Login;