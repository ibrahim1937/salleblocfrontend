import React, {useRef, useState} from 'react'
import { Container, Form , Card , Button, Alert } from 'react-bootstrap'
import { Link , useNavigate} from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {

    const emailRef = useRef()
    const passwordRef = useRef()

    const history = useNavigate();
    const [error, setError] = useState();

    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("")
        var response = await login(emailRef.current.value, passwordRef.current.value);
        if(response.status){
            history("/")
        }else{
            setError(response.message)
        }
    }

    return (
        <Container className='d-flex align-items-center justify-content-center' style={{ minHeight: "calc(100vh - 60px)" }}>
            <div className="w-100" style={{ maxWidth : "400px" }}>
                <Card>
                    <Card.Body>
                        <h2 className="text-center mb-4">
                            Sign In
                        </h2>
                        {error && (
                            <Alert variant="danger">{error}</Alert>
                        )}
                        <Form>
                            <Form.Group id="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type='email' ref={emailRef} required />
                            </Form.Group>
                            <Form.Group id="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' ref={passwordRef} required />
                            </Form.Group>
                            <Button type='submit' className="w-100" onClick={handleSubmit}>Sign In</Button>
                        </Form>
                    </Card.Body>
                    </Card> 
                <div className="w-100 text-center mt-2">
                    Need an account? <Link to={"/signup"}>Sign Up</Link> 
                </div>
            </div>
        </Container>
    )
}

export default Login
