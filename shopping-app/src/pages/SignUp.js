import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert, Spinner } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";

// Images
import Logo from "../images/logo.png";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useUserAuth();
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signUp(email, password);
      setLoading(false);
      navigate("/");
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className="d-flex">
      <div className="mx-auto">
        <div className="p-4 box my-5 custom-card">
          <Link to="/" className="d-flex">
            <img src={Logo} alt="" className="nav-img py-3 mx-auto" />
          </Link>
          <h2 className="my-3 text-center text-muted">SignUp</h2>
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
                  Sign up
                </button>
              </div>
            )}
          </Form>
        </div>
        <div className="p-4 box mt-3 text-center">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
