import '../../css/auth.css';
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupMutation, useValidateMutation } from "./authApiSlice";
import { userSchema } from '../../utils/userValidation';

const Signup = () => {
  const navigate = useNavigate();

  const userRef = useRef<HTMLInputElement>(null);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [code, setCode] = useState('')
  const [inputedCode, setInputedCode] = useState('');

  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const [validate, { isLoading: isValidateLoading }] = useValidateMutation();

  useEffect(() => {
    userRef?.current?.focus();
    setCode('');
  }, []);

  useEffect(() => {
    setErrMsg('');
  }, [username, password]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      if(code) {
        if(code != inputedCode) {
          setErrMsg('Codes do not match!');
          return;
        }
        
        const userData = await signup({ username, password, email }).unwrap();
        
        setErrMsg(userData?.msg);
        navigate('/');
      } else {
        const isValid = await userSchema.isValid({
          username, email, password,
        })

        if(!isValid) {
            setErrMsg('Invalid Form!');
            return;
        }

        const userData = await validate({ email, username }).unwrap();
        
        setErrMsg(userData?.msg);
        setCode(userData?.confirmation);
      }
    } catch(err: any) {
      const status = err?.originalStatus || err?.status || err?.response?.status;

      if (status === 409) {
        setErrMsg('User already exists!');
      } else {
        setErrMsg('Signup Failed!');
      }
    }
  }

  const handleUserInput = (e: any) => setUsername(e.target.value);
  const handleInputCodeInput = (e: any) => setInputedCode(e.target.value);
  const handlePwdInput = (e: any) => setPassword(e.target.value);
  const handleEmailInput = (e: any) => setEmail(e.target.value);

  const content = (isSignupLoading || isValidateLoading) ? <h1>Loading...</h1> : (
    (code) ? (
      <div className='auth--container'>
        <h1>Verify</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="inputCode" >Code</label>
                <input onChange={handleInputCodeInput} ref={userRef} type="text" name="code" id="inputCode"/>
            </div>
            {errMsg && (<p className={errMsg} aria-live="assertive">{errMsg}</p>)}
            <button type="submit">Submit</button>
        </form>
      </div>
    ) : (
    <div className='auth--container'>
        <h1>Sign up</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="inputUserName" >Username</label>
                <input onChange={handleUserInput} ref={userRef} type="text" name="username" id="inputUserName"/>
            </div>
            <div>
                <label htmlFor="inputEmail">Email</label>
                <input onChange={handleEmailInput} type="email" name="email" id="inputEmail" />
            </div>
            <div>
                <label htmlFor="exampleInputPassword1">Password</label>
                <input onChange={handlePwdInput} type="password" name="password" id="exampleInputPassword1" />
            </div>
            {errMsg && (<p className={errMsg} aria-live="assertive">{errMsg}</p>)}
            <button type="submit">Submit</button>
        </form>
    </div> )
  )

  return content;
}

export default Signup;



