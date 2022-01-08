import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet, useLocation} from 'react-router-dom';

function NotAuthRoutes() {
    const { currentUser } = useAuth();
    let location = useLocation();
    if(currentUser){
        return <Navigate to={-1}  state={{ from :  location}}/>
    }
    return <Outlet />
}

export default NotAuthRoutes
