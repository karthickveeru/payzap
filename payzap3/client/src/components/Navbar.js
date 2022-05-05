import React from 'react'
import {getSessionUser, logoutSession} from "../utils";
import { urlpaths } from "../CONSTANTS";
const {api_logout:logoutUrl} = urlpaths;
const user = getSessionUser()

const handleLogout = async() => {
  const response = await fetch(logoutUrl, {credentials:'include'})
    if(response.status === 200){
      logoutSession();
      window.location.href = '/login'
    }
}

function Navbar() {
    return(
        <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="/home">PayZap</a>
          </div>
          
          <ul className="nav navbar-nav navbar-right">
            <li><span>{user}</span> <button type="button" onClick={handleLogout} className="btn btn-secondary">Logout</button></li>
          </ul>
        </div>
      </nav>
        
    )
}

export default  Navbar