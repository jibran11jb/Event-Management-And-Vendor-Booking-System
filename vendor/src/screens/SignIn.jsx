import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Axios from "axios";
import AlertModel from "../components/AlertModel";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: "100vh",
    padding: theme.spacing(3),
    background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    minHeight: "calc(100vh - 48px)",
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    boxShadow: "0 22px 60px rgba(15, 24, 42, 0.12)",
  },
  hero: {
    background: "linear-gradient(135deg, #4c1d95 0%, #2563eb 100%)",
    color: "#fff",
    padding: theme.spacing(5, 4),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    padding: "0.5rem 0.95rem",
    borderRadius: 999,
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.24)",
    fontSize: "0.78rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.24px",
    marginBottom: theme.spacing(2),
  },
  heroTitle: {
    fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
    fontWeight: 800,
    lineHeight: 1.15,
    marginBottom: theme.spacing(1.5),
  },
  heroText: {
    fontSize: "1rem",
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.9)",
    maxWidth: 520,
  },
  heroList: {
    display: "grid",
    gap: theme.spacing(1.2),
    marginTop: theme.spacing(2.5),
  },
  heroItem: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    padding: "0.8rem 1rem",
    borderRadius: 14,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  paper: {
    height: "100%",
    padding: theme.spacing(5, 4),
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#fff",
  },
  avatar: {
    width: 56,
    height: 56,
    marginBottom: theme.spacing(1.5),
    background: "linear-gradient(135deg, #5b21b6 0%, #2563eb 100%)",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 1.5),
    padding: "12px 0",
    borderRadius: 14,
    textTransform: "none",
    fontWeight: 700,
    background: "linear-gradient(135deg, #5b21b6 0%, #2563eb 100%)",
    boxShadow: "0 10px 24px rgba(91, 33, 182, 0.22)",
    "&:hover": {
      background: "linear-gradient(135deg, #4c1d95 0%, #1d4ed8 100%)",
    },
  },
  footerText: {
    fontSize: "0.95rem",
    color: "#475569",
    marginTop: theme.spacing(0.5),
  },
  footerLink: {
    color: "#4c1d95",
    fontWeight: 700,
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
}));

export default function SignUp() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const classes = useStyles();
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
  });

  const [alert, setalert] = useState(false);

  const handlealert = () => {
    setalert(!alert);
  };

  const handleChange = (event) => {
    setSignUpForm({ ...signUpForm, [event.target.name]: event.target.value });
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    const data = {
      email: signUpForm.email,
      password: signUpForm.password,
    };

    try {
      const response = await Axios.post("/api/vendor/signin", data);

      if (response.data.message === "Invalid email or password") {
        handlealert();
      } else {
        ctxDispatch({ type: "VENDOR_SIGNIN", payload: response.data });
        localStorage.setItem("vendorInfo", JSON.stringify(response.data));
        navigate("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <>
      {alert && (
        <AlertModel
          title="Sign In failed"
          message="Enter correct email and password"
          status={state}
          handlealert={handlealert}
        />
      )}
      <Grid container component="main" className={classes.root}>
        <Grid item xs={12} md={7} className={classes.hero}>
          <div className={classes.heroBadge}>Vendor Portal</div>
          <Typography variant="h3" component="h1" className={classes.heroTitle}>
            Welcome back to your event workspace.
          </Typography>
          <Typography className={classes.heroText}>
            Manage bookings, respond to bids, and grow your business from a beautifully simple dashboard.
          </Typography>
          <div className={classes.heroList}>
            <div className={classes.heroItem}>
              <span>✨</span>
              <span>Respond to inquiries faster</span>
            </div>
            <div className={classes.heroItem}>
              <span>📅</span>
              <span>Keep your schedule organized</span>
            </div>
            <div className={classes.heroItem}>
              <span>💼</span>
              <span>Build stronger client relationships</span>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={5} component={Paper} elevation={0} className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h4" style={{ fontWeight: 800, marginBottom: 8 }}>
            Vendor Sign In
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
            Access your dashboard and manage your events.
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={signUpForm.email}
              onChange={handleChange}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={signUpForm.password}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              onClick={handleSubmitForm}
            >
              Sign In
            </Button>
            <Typography className={classes.footerText}>
              Need an account? <Link to="/signup" className={classes.footerLink}>Create one</Link>
            </Typography>
          </form>
        </Grid>
      </Grid>
    </>
  );
}
