import React, { useEffect, useRef, useState} from 'react'
import { Card, Form , Button , Container, Alert} from 'react-bootstrap'
import { Link , useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function SignUp() {

    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const firstNameRef = useRef()
    const secondNameRef = useRef()

    const history  = useNavigate();

    const [error, setError] = useState("");

    const { signup } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(passwordConfirmRef.current.value !== passwordRef.current.value){
            setError("The passwords don't match");
            return;
        }

        try{
            setError("")
            await signup(emailRef.current.value,passwordRef.current.value,firstNameRef.current.value, secondNameRef.current.value);
            history('/login');
        }catch(e){
            setError("Error Occured while creating the account! try later")
        }
        



        // Send the user data


        



    }

    return (
        <Container className='d-flex align-items-center justify-content-center' style={{ minHeight: "calc(100vh - 60px)" }}>
            <div className="w-100" style={{ maxWidth : "400px" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">
                            Sign Up
                        </h2>
                        {error && (
                            <Alert variant="danger">{error}</Alert>
                        )}
                        <Form>
                            <Form.Group id="firstname">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control type='text' ref={firstNameRef} required />
                            </Form.Group>
                            <Form.Group id="secondName">
                                <Form.Label>Second Name</Form.Label>
                                <Form.Control type='text' ref={secondNameRef} required />
                            </Form.Group>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' ref={passwordRef} required />
                            </Form.Group>
                            <Form.Group id="password-confirm">
                                <Form.Label>Password Confirmation</Form.Label>
                                <Form.Control type='password' ref={passwordConfirmRef} required />
                            </Form.Group>
                            <Button type='submit' className="w-100" onClick={handleSubmit}>Sign Up</Button>
                        </Form>
                    </Card.Body>
                    </Card> 
                <div className="w-100 text-center mt-2">
                    Already have an account? <Link to={"/login"}>Sign In</Link> 
                </div>
            </div>
        </Container>
    )
}

export default SignUp
