import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet, useLocation} from 'react-router-dom';
import Navbar from '../components/Navbar';


function AuthRoutes({ element: Element, ...rest}) {

    const { currentUser } = useAuth();
    let location = useLocation();
    if(currentUser){
        return <>
        <Navbar />
        <Outlet />
        </>
    }
    return <Navigate to="/login"  state={{ from :  location}}/>
}

export default AuthRoutes
