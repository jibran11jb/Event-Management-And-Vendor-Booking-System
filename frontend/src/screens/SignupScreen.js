import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils.js';
import { FiArrowRight, FiCalendar, FiCheckCircle, FiShield, FiUsers } from 'react-icons/fi';
import './AuthScreen.css';

// ── Disposable / spam email domains blocklist
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.biz', 'guerrillamail.de', 'guerrillamail.info', 'guerrillamailblock.com',
  'tempmail.com', 'temp-mail.org', 'temp-mail.ru', 'tempinbox.com', 'tempr.email',
  'throwam.com', 'throwaway.email', 'trashmail.com', 'trashmail.me', 'trashmail.net',
  'trashmail.at', 'trashmail.io', 'trashmail.org', 'trashmail.xyz', 'dispostable.com',
  'maildrop.cc', 'yopmail.com', 'yopmail.fr', 'yopmail.net', 'spam4.me',
  'spamgourmet.com', 'spamgourmet.net', 'spamgourmet.org',
  'getnada.com', 'getairmail.com', 'fakeinbox.com', 'fake-box.com', 'fakemailgenerator.com',
  'mailnull.com', 'mailnesia.com', 'mailexpire.com', 'mail-temporaire.fr',
  'sharklasers.com', 'guerrillamail.info', 'grr.la', 'spam.la',
  'getonemail.net', 'mytrashmail.com', 'sofimail.com', 'suremail.info',
  'throwam.com', 'throwam.net', '0-mail.com', '0815.ru', '0box.eu',
  '10minutemail.com', '10minutemail.net', '10minutemail.org', '10minutemail.co.uk',
  '10minutemail.de', '10minutemail.pl', '10minutemail.pro', '10minutemail.us',
  '10minemail.com', '10minutesmail.com', '20minutemail.com', '20minutemail.it',
  'mailmoat.com', 'emailondeck.com', 'discard.email', 'discardmail.com',
  'discardmail.de', 'spamfree24.org', 'spamfree24.de', 'spamfree24.net',
  'spamfree24.eu', 'spamfree24.info', 'filzmail.com', 'fakemail.net',
  'mohmal.com', 'mailnull.com', 'deadaddress.com', 'disposableaddress.com',
  'mailscrap.com', 'mintemail.com', 'mailnew.com', 'binkmail.com',
  'owlpic.com', 'spamhere.net', 'no-spam.ws', 'nospam.ze.tc',
  'rmqkr.net', 'klzlk.com', 'byom.de', 'pookmail.com',
  'gishpuppy.com', 'hulapla.de', 'incognitomails.com', 'e4ward.com',
  'spamobox.com', 'shieldemail.com', 'mailincubator.com', 'spamcowboy.com',
  'spamcowboy.net', 'spamcowboy.org', 'mailblocks.com', 'mailzilla.com',
  'mailzilla.org', 'safetymail.info', 'jetable.fr.nf', 'jetable.net',
  'jetable.org', 'jetable.com', 'noref.in', 'deadletter.ga',
  'bugmenot.com', 'spamgob.com', 'spamspot.com', 'spamstack.net',
  'tempinbox', 'throwaway', 'disposable', 'trashmail', 'spammail',
  'fakeinbox', 'nospam', 'antispam',
]);

const ALLOWED_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.com.pk',
  'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
  'icloud.com', 'me.com', 'mac.com',
  'protonmail.com', 'protonmail.ch', 'pm.me',
  'aol.com', 'zoho.com',
  'edu', 'ac.pk', 'edu.pk', 'ac.uk',
]);

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address.';
  }

  const domain = email.split('@')[1].toLowerCase();

  if (ALLOWED_DOMAINS.has(domain)) return null;

  const parts = domain.split('.');
  const tld = parts[parts.length - 1];
  if (tld === 'edu' || domain.endsWith('.ac.pk') || domain.endsWith('.edu.pk') || domain.endsWith('.ac.uk')) {
    return null;
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return 'Disposable or temporary email addresses are not allowed. Please use a real email.';
  }

  const disposableKeywords = [
    'tempmail', 'throwaway', 'trashmail', 'mailinator', 'guerrilla',
    'disposable', 'fakeinbox', 'spammail', 'yopmail', '10minute',
    'minutemail', 'burner', 'throwam', 'discard', 'nospam',
  ];
  for (const kw of disposableKeywords) {
    if (domain.includes(kw)) {
      return 'Disposable or temporary email addresses are not allowed. Please use a real email.';
    }
  }

  if (parts.length < 2) {
    return 'Please enter a valid email address.';
  }

  return null;
}

const heroHighlights = [
  { icon: FiUsers, text: 'Create your event account in minutes' },
  { icon: FiShield, text: 'Secure and verified vendor access' },
  { icon: FiCheckCircle, text: 'Manage your bookings with confidence' },
];

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/home';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val.length > 5) {
      const err = validateEmail(val);
      setEmailError(err || '');
    } else {
      setEmailError('');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    if (emailErr) {
      toast.error(emailErr);
      setEmailError(emailErr);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const { data } = await Axios.post('/api/users/signup', {
        name,
        email,
        password,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate(redirect || '/home');
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
        <div className="hero-badge">Launch your event journey</div>
        <h1>Create your account and start planning in minutes.</h1>
        <p>
          Join thousands of customers discovering venues, comparing vendors, and booking memorable events with ease.
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
            <title>Sign Up</title>
          </Helmet>

          <div className="auth-brand">
            <div className="auth-brand-icon">
              <FiCalendar size={20} />
            </div>
            <span>EventOS</span>
          </div>

          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">Sign up to discover curated events and book the perfect experience.</p>

          <Form onSubmit={submitHandler} className="auth-form">
            <Form.Group controlId="name">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                className="auth-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                className="auth-input"
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                isInvalid={!!emailError}
                placeholder="you@example.com"
              />
              <Form.Control.Feedback type="invalid">
                {emailError}
              </Form.Control.Feedback>
              {!emailError && email.includes('@') && (
                <div className="auth-helper-text">✓ Valid email address</div>
              )}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                className="auth-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose a password"
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                className="auth-input"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
              />
            </Form.Group>

            <Button type="submit" className="auth-btn" disabled={!!emailError}>
              Create Account
              <FiArrowRight size={16} />
            </Button>
          </Form>

          <div className="auth-footer">
            Already have an account? <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
