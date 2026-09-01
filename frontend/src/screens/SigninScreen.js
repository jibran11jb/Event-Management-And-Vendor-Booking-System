import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils.js";
import { FiArrowRight, FiCalendar, FiCheckCircle, FiShield, FiUsers } from "react-icons/fi";
import "./AuthScreen.css";

const heroHighlights = [
  { icon: FiUsers, text: "Connect with trusted event vendors" },
  { icon: FiShield, text: "Secure booking and payments" },
  { icon: FiCheckCircle, text: "Track every detail in one place" },
];

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/home";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await Axios.post("/api/users/signin", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate(redirect || "/home");
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <div className="auth-screen">
      <div className="auth-hero">
        <div className="hero-badge">Pakistan&apos;s #1 Event Platform</div>
        <h1>Plan smarter. Book faster. Celebrate better.</h1>
        <p>
          Discover venues, connect with verified vendors, and manage every event detail from one polished experience.
        </p>
        <div className="auth-hero-list">
          {heroHighlights.map(({ icon: Icon, text }) => (
            <div key={text} className="auth-hero-item">
              <Icon size={16} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="auth-card">
        <div className="auth-card-inner">
          <Helmet>
            <title>Sign In</title>
          </Helmet>

          <div className="auth-brand">
            <div className="auth-brand-icon">
              <FiCalendar size={20} />
            </div>
            <span>EventOS</span>
          </div>

          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Sign in to continue planning your next unforgettable event.</p>

          <Form onSubmit={submitHandler} className="auth-form">
            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                className="auth-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="auth-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </Form.Group>

            <Button type="submit" className="auth-btn">
              Sign In
              <FiArrowRight size={16} />
            </Button>
          </Form>

          <div className="auth-footer">
            New customer? <Link to={`/signup?redirect=${redirect}`}>Create your account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
