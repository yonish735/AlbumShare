import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';

// Generic input field for SignIn, SignUp and Forgot Password forms
const Input = ({ name, handleChange, label, half, autoFocus, type, handleShowPassword, value, tip, errorText }) => (
  <Grid item xs={12} sm={half ? 6 : 12}>
    <TextField
      name={name}
      onChange={handleChange}
      variant="outlined"
      required
      fullWidth
      label={label}
      autoFocus={autoFocus}
      type={type || 'text'}
      value={value}
      autoComplete="off"
      error={!!errorText}
      helperText={errorText}
      InputProps={
        name === 'password' || name === 'confirmPassword'
          ? {
            endAdornment: (<>
              <InputAdornment position="end">
                <IconButton onClick={handleShowPassword}>
                  {type === 'password' ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
              {tip && (
                <Tooltip title={tip}>
                  <IconButton aria-label="help">
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
              )}
            </>)
          }
          : tip ? {
            endAdornment: (
              <Tooltip title={tip}>
                <IconButton aria-label="help">
                  <HelpIcon />
                </IconButton>
              </Tooltip>
            )
          } : null
      }
    />
  </Grid>
);

Input.propTypes = {
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  half: PropTypes.bool,
  autoFocus: PropTypes.bool,
  type: PropTypes.string,
  tip: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  errorText: PropTypes.string,
  handleShowPassword: PropTypes.func,
  value: PropTypes.string.isRequired,
};

export default Input;
