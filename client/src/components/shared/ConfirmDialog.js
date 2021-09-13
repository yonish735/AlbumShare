import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import useStyles from './styles';

// Confirmation dialog
const ConfirmDialog = ({ open, onClose, title, children, onConfirm }) => {
  const classes = useStyles();
  return (
    <Dialog
      disableBackdropClick
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
        >
          No
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ])
};

export default ConfirmDialog;
