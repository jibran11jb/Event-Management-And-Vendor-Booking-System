import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputMask from "react-input-mask";
import Axios from "axios";
import AlertModel from "../components/AlertModel";
import {
  Grid,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  MenuItem,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";

const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info',
  'tempmail.com', 'temp-mail.org', 'temp-mail.ru', 'tempinbox.com', 'tempr.email',
  'throwam.com', 'throwaway.email', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'trashmail.at', 'trashmail.io', 'trashmail.org', 'trashmail.xyz', 'dispostable.com',
  'maildrop.cc', 'yopmail.com', 'yopmail.fr', 'yopmail.net', 'spam4.me',
  'spamgourmet.com', 'getnada.com', 'getairmail.com', 'fakeinbox.com', 'fake-box.com',
  'mailnull.com', 'mailnesia.com', 'sharklasers.com', 'grr.la', 'spam.la',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '20minutemail.com',
  'mailmoat.com', 'emailondeck.com', 'discard.email', 'discardmail.com',
  'mohmal.com', 'deadaddress.com', 'disposableaddress.com', 'mintemail.com',
  'owlpic.com', 'no-spam.ws', 'pookmail.com', 'gishpuppy.com',
  'incognitomails.com', 'spamobox.com', 'mailzilla.com', 'mailzilla.org',
  'bugmenot.com', 'spamspot.com', 'spamstack.net', 'fakemail.net',
  'filzmail.com', 'binkmail.com', 'spamhere.net', 'rmqkr.net',
  'byom.de', 'klzlk.com', 'hulapla.de', 'e4ward.com',
]);

const DISPOSABLE_KEYWORDS = [
  'tempmail', 'throwaway', 'trashmail', 'mailinator', 'guerrilla',
  'disposable', 'fakeinbox', 'spammail', 'yopmail', '10minute',
  'minutemail', 'burner', 'throwam', 'discard', 'nospam',
];

const ALLOWED_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.com.pk',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'protonmail.ch', 'pm.me',
  'aol.com', 'zoho.com',
]);

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) return 'Please enter a valid email address.';

  const domain = email.split('@')[1].toLowerCase();

  if (ALLOWED_DOMAINS.has(domain)) return null;

  if (domain.endsWith('.edu') || domain.endsWith('.ac.pk') ||
      domain.endsWith('.edu.pk') || domain.endsWith('.ac.uk')) return null;

  if (DISPOSABLE_DOMAINS.has(domain))
    return 'Disposable or temporary email addresses are not allowed. Please use a real email.';

  for (const kw of DISPOSABLE_KEYWORDS) {
    if (domain.includes(kw))
      return 'Disposable or temporary email addresses are not allowed. Please use a real email.';
  }

  const parts = domain.split('.');
  if (parts.length < 2) return 'Please enter a valid email address.';

  return null;
}

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
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cnic: "",
    phone: "",
    address: "",
    businessName: "",
  });
  const [emailError, setEmailError] = useState("");
  const [alert, setalert] = useState(false);

  const handlealert = () => {
    setalert(!alert);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignUpForm((prev) => ({ ...prev, [name]: value }));

    if (name === "email" && value.length > 5) {
      setEmailError(validateEmail(value) || "");
    } else if (name === "email") {
      setEmailError("");
    }
  };

  const handleSubmitForm = async (event) => {
    event.preventDefault();

    const emailErr = validateEmail(signUpForm.email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    if (signUpForm.password !== signUpForm.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const data = {
      name: signUpForm.name,
      email: signUpForm.email,
      password: signUpForm.password,
      phone: signUpForm.phone,
      address: signUpForm.address,
      businessName: signUpForm.businessName,
      CNIC: signUpForm.cnic,
    };

    try {
      const response = await Axios.post("/api/vendor/", data);
      if (response.data.message === "Email already exists") {
        handlealert();
      } else {
        ctxDispatch({ type: "VENDOR_SIGNIN", payload: response.data });
        localStorage.setItem("vendorInfo", JSON.stringify(response.data));
        navigate("/vendorverification");
      }
    } catch (error) {
      const msg = error?.response?.data?.message || "Registration failed. Please try again.";
      alert(msg);
    }
  };

  return (
    <>
      {alert && (
        <AlertModel
          title="SignUp failed"
          message="Enter correct email and password"
          status={state}
          handlealert={handlealert}
        />
      )}
      <Grid container component="main" className={classes.root}>
        <Grid item xs={12} md={7} className={classes.hero}>
          <div className={classes.heroBadge}>Vendor Registration</div>
          <Typography variant="h3" component="h1" className={classes.heroTitle}>
            Join the platform and grow your event business.
          </Typography>
          <Typography className={classes.heroText}>
            Create an account to list services, receive bookings, and keep every detail in one place.
          </Typography>
          <div className={classes.heroList}>
            <div className={classes.heroItem}>
              <span>🚀</span>
              <span>Reach more clients instantly</span>
            </div>
            <div className={classes.heroItem}>
              <span>📣</span>
              <span>Showcase your business professionally</span>
            </div>
            <div className={classes.heroItem}>
              <span>🔒</span>
              <span>Stay secure with verified bookings</span>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} md={5} component={Paper} elevation={0} className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>

          <Typography component="h1" variant="h4" style={{ fontWeight: 800, marginBottom: 8 }}>
            Vendor Sign Up
          </Typography>
          <Typography variant="body2" color="textSecondary" style={{ marginBottom: 8 }}>
            Start building your vendor profile today.
          </Typography>
          <form className={classes.form} onSubmit={handleSubmitForm}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoComplete="name"
              value={signUpForm.name}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              autoComplete="email"
              value={signUpForm.email}
              onChange={handleChange}
              error={!!emailError}
              helperText={
                emailError
                  ? emailError
                  : signUpForm.email.includes('@') && !emailError
                  ? '✓ Valid email address'
                  : 'Use a real email (Gmail, Yahoo, Outlook, etc.). Disposable emails are not allowed.'
              }
              FormHelperTextProps={{
                style: {
                  color: emailError
                    ? '#d32f2f'
                    : signUpForm.email.includes('@') && !emailError
                    ? '#2e7d32'
                    : '#666',
                },
              }}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="cnic"
              label="CNIC"
              name="cnic"
              autoComplete="cnic"
              value={signUpForm.cnic}
              onChange={handleChange}
            />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="country-code"
                  label="Country Code"
                  name="country-code"
                  autoComplete="country-code"
                  value={signUpForm.countryCode}
                  onChange={handleChange}
                  select
                >
                  <MenuItem value="">Select</MenuItem>
                  <MenuItem value="+92">Pakistan (+92)</MenuItem>
                  <MenuItem value="+1">USA (+1)</MenuItem>
                  <MenuItem value="+971">Dubai (+971)</MenuItem>
                  <MenuItem value="+44">UK (+44)</MenuItem>
                  <MenuItem value="+358">Finland (+358)</MenuItem>
                  <MenuItem value="+353">Ireland (+353)</MenuItem>
                  <MenuItem value="+49">Germany (+49)</MenuItem>
                  <MenuItem value="+86">China (+86)</MenuItem>
                  <MenuItem value="+91">India (+91)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={8}>
                <InputMask
                  mask="999-999-9999"
                  maskChar=" "
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, "");
                    e.target.value = value;
                    setSignUpForm({ ...signUpForm, phone: value });
                  }}
                >
                  {() => (
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="phone"
                      label="Phone Number"
                      name="phone"
                      autoComplete="phone"
                    />
                  )}
                </InputMask>
              </Grid>
            </Grid>

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="business-name"
              label="Business Name"
              name="businessName"
              autoComplete="business-name"
              value={signUpForm.businessName}
              onChange={handleChange}
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="address"
              label="Address"
              id="address"
              autoComplete="address"
              value={signUpForm.address}
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

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              value={signUpForm.confirmPassword}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className={classes.submit}
              disabled={!!emailError}
            >
              Sign Up
            </Button>
          </form>
          <Typography className={classes.footerText}>
            Already have an account? <Link to="/" className={classes.footerLink}>Log in</Link>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
