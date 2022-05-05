import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/login.css"; 
import { urlpaths } from "../CONSTANTS";
import {setSessionUser, getSessionUser} from "../utils"
import Alert from '../components/Alert'




function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const {api_login:loginUrl} = urlpaths;
    

    const  handleSubmit = (event) => {
        event.preventDefault();
        fetch(loginUrl, {
            method: 'post',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({username, password}),
            credentials:'include'
        }).then((response) => {
            if(response.status === 200) {
                setSessionUser(username);
                window.location.href = '/home';
            } else {
                setError(true);
            }
        }).catch((error) => setError(true))
        
    }
    useEffect(()=> {
        const isLoggedIn = () => {
            if(getSessionUser()) {
                window.location.href = '/home'
            }
        }
        isLoggedIn();
    })

    return (
        <>
        <div className="text-center m-5-auto">
            <h2>Karthick's Rough Demo Page</h2>
            <form >
                {error ? <Alert msg={'Invalid Credentials'}/> : null}
                <p>
                    <label>Username </label><br/>
                    <input type="text" name="first_name" onChange={(e) => setUsername(e.target.value)} required />
                </p>
                <p>
                    <label>Password</label>
                    <br/>
                    <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                </p>
                <p>
                    <Button variant="primary" onClick={handleSubmit} >Login</Button>
                </p>
            </form>
            
        </div>
        </>
    )
    
} 

export default Login