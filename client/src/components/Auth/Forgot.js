import React, { useCallback, useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { forgot, sendToken as token } from '../../redux/actions/auth';
import Input from './Input';
import useStyles from './styles';
import PropTypes from 'prop-types';
import album from '../../images/album.svg';

const initialState = { email: '', password: '', confirmPassword: '', token: '' };

// Restore Password
const Forgot = ({ clear }) => {
  const [form, setForm]                   = useState(initialState);
  const [errors, setErrors]               = useState(initialState);
  const [isNewPassword, setIsNewPassword] = useState(false);
  const authErrors                        = useSelector((state) => state.auth.errors);

  const dispatch = useDispatch();
  const history  = useHistory();

  const classes  = useStyles();

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword              = () => setShowPassword(!showPassword);

  const sendToken = (e) => {
    // Stop bubbling the event
    e.preventDefault();
    const { email } = form;

    if (errors.email) {
      return true;
    }
    setForm({ ...initialState, email });
    setIsNewPassword(true);
    dispatch(token(email));
  };

  // Validate field callback
  const validate = useCallback((field, errorCondition, error) => {
    // Call the supplied function. If it returns true then it's an error
    const value = errorCondition() ? error : '';
    setErrors(errors => ({ ...errors, [field]: value }));
  }, []);

  // All these useEffect are validating input
  // All fields must be filled in -- verified by Input.required

  // Email format
  useEffect(() => {
    validate('email',
      () => (form.email !== '' && !form.email.match('^(([^<>()[\\]\\\\.,;:\\s@\\"]+(\\.[^<>()[\\]\\\\.,;:\\s@\\"]+)*)|(\\".+\\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{1,}))$')),
      'Email is incomplete');
  }, [form.email, validate]);


  // Password should be at least six numbers and letters
  useEffect(() => {
    validate('password',
      () => (form.password !== '' && (form.password !== '' && (form.password.length < 6 || !form.password.match('^(?=.*\\d)(?=.*[a-zA-Z]).{6,}$')))),
      'Password should be at least six numbers and letters');
  }, [form.password, validate]);
  // Password should be equal to Confirmation
  useEffect(() => {
    validate('confirmPassword',
      () => (form.password !== '' && form.confirmPassword !== form.password),
      'Password and confirmation don’t match');
  }, [form.confirmPassword, form.password, validate]);

  const handleSubmit = (e) => {
    // Stop bubbling the event
    e.preventDefault();
    if (errors.token || errors.email || errors.password || errors.confirmPassword) {
      return true;
    }

    // Create user structure
    const user = {
      token: form.token,
      email: form.email,
      password: form.password,
    };
    // Perform `forgot` action
    dispatch(forgot(user, history));
  };

  // Handle change in Input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Container component="main" maxWidth="sm">
      <Paper className={classes.paper} elevation={3}>
        <img className={classes.image} src={album} alt="logo" height="100" />
        <Typography component="h1" className={classes.title} variant="h2" align="center"><span className={classes.albumAlbum}>Album</span><span className={classes.blueText}>Share</span></Typography>
        <Typography className={classes.blueText} component="h2" variant="h5">Forgot password</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Input name="email" label="Email Address" value={form.email} handleChange={handleChange} type="email" errorText={errors.email} />
            {isNewPassword && (
              <>
                <Input name="token" label="Token (sent by email)" value={form.token} handleChange={handleChange} type="text" errorText={errors.token} />
                <Input name="password" label="Password" value={form.password} handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} errorText={errors.password} />
                <Input name="confirmPassword" label="Repeat Password" value={form.confirmPassword} handleChange={handleChange} type="password" errorText={errors.confirmPassword} />
              </>
            )}
          </Grid>
          {authErrors && <div className={classes.error}>{authErrors}</div>}
          {isNewPassword && <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>Store new password</Button>}
          <Button type="submit" fullWidth variant="contained" color="primary" className={isNewPassword ? classes.resubmit : classes.submit} onClick={sendToken}>
            {isNewPassword ? 'Re-send me token' : 'Send me token'}
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Button className={classes.blueText} onClick={clear}>Sign in</Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

Forgot.propTypes = {
  clear: PropTypes.func.isRequired,
};

export default Forgot;
