import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';


const auth = getAuth(app);

const Login = () => {

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const emailRef = useRef()

    const handleLogin = event => {
        console.log('clicked')
        setError('')
        setSuccess('')
        event.preventDefault()
        const form = event.target;
        const email = form.email.value;
        const password = form.password.value;
        console.log(email, password)
        //validate 
        if(!/(?=.*[A-Z])/.test(password)){
            setError('please add at least one uppercase ');
            return;
        }else if(!/(?=.*[0-9].*[0-9])/.test(password)){
            setError('Please add at least two digits');
            return;
        }else if(password.length<6){
            setError('please minimun 6 charactar');
            return;
        }

        signInWithEmailAndPassword(auth,email,password)
        .then(result =>{
            const loggedUser = result.user;
            console.log(loggedUser)
            setSuccess('User Login Successful')
            setError('')
        })
        .catch(error =>{
            console.log(error);
            setError(error.message)
        })


    }
    const handleResetPassword =(event) =>{
        const email =emailRef.current.value ;
        if(!email){
            alert('please provide your email address for reset password');
            return
        }
        sendPasswordResetEmail(auth,email)
        .then(() =>{
            alert('please check your email')
        })
        .catch(error =>{
            console.log(error.message);
            setError(error.message)
        })
    }

    return (
        <div className='d-flex justify-content-center'>

            <form className="w-25" onSubmit={handleLogin}>
                <h2> Login Here</h2>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        ref={emailRef}
                        name='email'
                        aria-describedby="emailHelp"
                        required
                    />

                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input type="password" name='password' className="form-control" id="password" required />
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
                <small>new to this website ? Please <Link to='/register'>Register</Link> </small>
                <br />
                <small>Forget Password ? <button onClick={handleResetPassword} className='btn btn-link'>Reset Password</button> </small>
                <p className='text-danger'>{error}</p>
                <p className='text-success'>{success}</p>
            </form>

        </div>
    );
};

export default Login;