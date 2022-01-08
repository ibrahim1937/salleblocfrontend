import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import { endpoint } from '../utils/Constants';
import { postRequest } from '../utils/RequestHelper';

const AuthContext = React.createContext();

export function useAuth(){
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState();
    const [loading, setLoading] = useState(true)
    const [change, setChange] = useState(0);

    async function signup(email, password, firstName, secondName){
        // Create the user with email and password
        const { data } = await postRequest(endpoint + "/api/signup", {
            email,
            password,
            firstName,
            secondName
        })

        if(data){
            // user account created 
            return true
        }
        return false
    }

    async function login(email, password){

        const response = await axios.post(endpoint + "/api/login", {
            email,
            password
        }).catch(error => {
            return {
                status: false,
                message : error.response.data.message,
            }
        })

        

        const { data } = response;

        if(data){
            sessionStorage.setItem("firstName", data.firstName);
            sessionStorage.setItem("secondName", data.secondName);
            sessionStorage.setItem("email", data.email);
            sessionStorage.setItem("id", data.id)
            setChange(change +1)
            return {
                ...data,
                status : true
            }
        }
        return response

    }


    function logout(){
        sessionStorage.clear();
        setChange(change + 1)
    }

    const value = {
        currentUser,
        signup,
        login,
        logout
    }

    useEffect(() => {
        // set the variable current user
        if(sessionStorage.getItem("firstName") && sessionStorage.getItem("secondName") && sessionStorage.getItem("email") && sessionStorage.getItem("id")){
            setCurrentUser({
                firstName: sessionStorage.getItem("firstName"),
                secondName : sessionStorage.getItem("secondName"),
                id : sessionStorage.getItem("id"),
                email : sessionStorage.getItem("email")
            })
        }else {
            setCurrentUser(null)
        }
        setLoading(false);
    }, [change])

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}


