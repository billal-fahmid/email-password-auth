import React, { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import app from '../../firebase/firebase.config';
import { Link } from 'react-router-dom';

const auth = getAuth(app);

const Register = () => {

  const [error , setError] = useState(' ');
  const [success , setSuccess] = useState(' ')
     // const [password, setPassword] = useState()

    const handleSubmit = (event) =>{
        setSuccess(' ')
        setError(' ')
        // prevent page refresh
        event.preventDefault();
        // collect form data
        const email = event.target.email.value;
        const password = event.target.password.value;
        const name = event.target.name.value;
        console.log(email , password ,name)
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

        //create user in firebase 

        createUserWithEmailAndPassword(auth,email,password)
        .then(result => {
            const loggedUser = result.user;
            console.log(loggedUser)
            setError(' ');
            event.target.reset();
            setSuccess('User Create a Successfully');
            sentVerificationEmail(loggedUser);
            updateUserData(result.user,name)
        })
        .catch(error =>{
            // console.error(error.message)
            setError(error.message)
            
        })
    }

    const sentVerificationEmail = (user) =>{
        sendEmailVerification(user)
        .then((result) =>{
            console.log(result);
            alert ('please verify your email address')
        })
    }

    const updateUserData =(user,name) =>{
        updateProfile(user,{
            displayName:name
        })
        .then(() =>{
            console.log('user name updated')
        })
        .catch(error=>{
            // console.log(error);
            setError(error.message)
        })
    }

    const handleEmailChange = (event) =>{
        // console.log(event.target.value)
        // setEmail(event.target.value)
    }
    const handlePasswordBlur = (event) => {
        // console.log(event.target.value)
    }

    return (
        <div className='w-50 mx-auto mt-5'>
            <h4>Please Register</h4>
            <form onSubmit={handleSubmit} >
                <input className='w-50 mb-4 rounded ps-2' required  type="text" id='name' placeholder='Your Name' name='name' />
                <br />
                <input className='w-50 mb-4 rounded ps-2' required onChange={handleEmailChange} type="email" id='email' placeholder='Your Email' name='email' />
                <br />
                <input className='w-50 mb-4 rounded ps-2' required onBlur={handlePasswordBlur} type="password" name='password' id='password' placeholder='Password'  /> <br />
                <input className='btn btn-primary ' type="submit" value='Register' />
            </form>
            <small>Already Have an Account ? Please <Link to='/login'>Login</Link> </small>

            <p className='text-danger'>{error}</p>
            <p className='text-success'>{success}</p>
        </div>
    );
};

export default Register;