import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { logout, signin, signup } from '../../redux/actions/auth';
import Input from './Input';
import useStyles from './styles';
import Forgot from './Forgot';
import album from '../../images/album.svg';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

// SignIn and SignUp forms
const Auth = () => {
  const [form, setForm]         = useState(initialState);
  const [errors, setErrors]     = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const userId                  = useSelector((state) => state.auth?.user?.id);
  const authErrors              = useSelector((state) => state.auth.errors);
  const dispatch                = useDispatch();
  const history                 = useHistory();
  const classes                 = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword              = () => setShowPassword(!showPassword);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowConfirmPassword                     = () => setShowConfirmPassword(!showConfirmPassword);

  // Switch between Sign In and Sign Up
  const switchModeInUp = (prevIsSignup) => {
    dispatch(logout());
    setForm(initialState);
    setErrors(initialState);
    setIsSignup(!prevIsSignup);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Switch back from Forgot to Sign In
  const clear = () => {
    dispatch(logout());
    setIsForgot(false);
  };

  const handleSubmit = (e) => {
    // Stop bubbling the event
    e.preventDefault();
    if (errors.firstName || errors.lastName || errors.email || errors.password || errors.confirmPassword) {
      return true;
    }

    // Create user structure
    const user     = {
      first_name: form.firstName,
      last_name: form.lastName,
      email: form.email,
      password: form.password,
    };
    // Select an appropriate function to send this structure
    const signFunc = isSignup ? signup : signin;
    dispatch(signFunc(user, history));
  };

  // Validate field callback
  const validate = useCallback((field, errorCondition, error) => {
    if (!isSignup) {
      // Only Sign Up form requires validation
      return;
    }
    // Call the supplied function. If it returns true then it's an error
    const value = errorCondition() ? error : '';
    setErrors(errors => ({ ...errors, [field]: value }));
  }, [isSignup]);

  // All these useEffect are validating input
  // All fields must be filled in -- verified by Input.required

  // Email format
  useEffect(() => {
    validate('email',
      () => (form.email !== '' && !form.email.match('^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{1,}))$')),
      'Email is incomplete');
  }, [form.email, isSignup, validate]);

  // First and Last names should be at least 2 letters and include letters only
  useEffect(() => {
    validate('firstName',
      () => (form.firstName !== '' && (form.firstName.length < 2 || !form.firstName.match('^[a-zA-Z][a-zA-Z ]+$'))),
      'First Name should be at least 2 letters and include letters only');
  }, [form.firstName, isSignup, validate]);
  useEffect(() => {
    validate('lastName',
      () => (form.lastName !== '' && (form.lastName.length < 2 || !form.lastName.match('^[a-zA-Z][a-zA-Z ]+$'))),
      'Last Name should be at least 2 letters and include letters only');
  }, [form.lastName, isSignup, validate]);

  // Password should be at least six numbers and letters
  useEffect(() => {
    validate('password',
      () => (form.password !== '' && (form.password !== '' && (form.password.length < 6 || !form.password.match('^(?=.*\\d)(?=.*[a-zA-Z]).{6,}$')))),
      'Password should be at least six numbers and letters');
  }, [form.password, isSignup, validate]);
  // Password should be equal to Confirmation
  useEffect(() => {
    validate('confirmPassword',
      () => (form.password !== '' && form.confirmPassword !== form.password),
      'Password and confirmation don’t match');
  }, [form.confirmPassword, form.password, isSignup, validate]);

  // Handle change in Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (userId) {
    history.push('/');
  }

  if (isForgot) {
    // This is a Forgot Password state
    dispatch(logout());
    return <Forgot clear={clear} />;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper className={classes.paper} elevation={3}>
        <img className={classes.image} src={album} alt="logo" height="100" />
        <Typography component="h1" className={classes.title} variant="h2" align="center"><span className={classes.albumAlbum}>Album</span><span className={classes.blueText}>Share</span></Typography>
        <Typography className={classes.blueText} component="h2" variant="h5">{isSignup ? 'Sign up' : 'Sign in'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignup && (
              <>
                <Input name="firstName" label="First Name" value={form.firstName} handleChange={handleChange} autoFocus half tip="At least 2 characters (a-z A-Z)" errorText={errors.firstName} />
                <Input name="lastName" label="Last Name" value={form.lastName} handleChange={handleChange} half tip="At least 2 characters (a-z A-Z)" errorText={errors.lastName} />
              </>
            )}
            <Input name="email" label="Email" value={form.email} handleChange={handleChange} type="email" tip={isSignup && 'Pattern should be xxx@xxx.xxx'} errorText={errors.email} />
            <Input name="password" label="Password" value={form.password} handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} tip={isSignup && 'At least six characters and contain letters (a-z A-Z) and numbers (0-9)'} errorText={errors.password} />
            {isSignup &&
            <Input name="confirmPassword" label="Repeat Password" value={form.confirmPassword} handleChange={handleChange} type={showConfirmPassword ? 'text' : 'password'} handleShowPassword={handleShowConfirmPassword} tip="Repeat password" errorText={errors.confirmPassword} />}
          </Grid>
          {authErrors && <div className={classes.error}>{authErrors}</div>}
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          <Grid container justify="flex-end" className={classes.column}>
            <Grid item>
              {!isSignup && <Button className={classes.forgotPassword} onClick={() => setIsForgot(true)}>Forgot password</Button>}
              <Button className={classes.blueText} onClick={() => switchModeInUp(isSignup)}>
                {isSignup ? 'Sign in' : 'Sign Up'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

Auth.propTypes = {};

export default Auth;
