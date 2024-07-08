import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Spinner } from "react-bootstrap";
import GoogleButton from "react-google-button";
import { useUserAuth } from "../context/UserAuthContext";

// Images
import Logo from "../images/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { logIn, googleSignIn } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logIn(email, password);
      setLoading(false);
      navigate("/shop");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      await googleSignIn();
      navigate("/shop");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="d-flex">
      <div className="mx-auto">
        <div className="p-4 box my-5 custom-card">
          <Link to="/" className="d-flex">
            <img src={Logo} alt="" className="nav-img py-3 mx-auto" />
          </Link>
          <h2 className="my-3 text-center text-muted">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="email"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {loading ? (
              <div className="w-100 d-flex">
                <Spinner className="mx-auto text-warning" />
              </div>
            ) : (
              <div className="d-grid gap-2">
                <button className="btn btn-success rounded" type="Submit">
                  Log In
                </button>
              </div>
            )}
          </Form>
          <hr />
          <div>
            <GoogleButton
              className="g-btn"
              type="dark"
              onClick={handleGoogleSignIn}
            />
          </div>
        </div>
        <div className="p-4 box mt-3 text-center">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
