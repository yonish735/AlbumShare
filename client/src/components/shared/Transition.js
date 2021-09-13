import React, { forwardRef } from 'react';
import Slide from '@material-ui/core/Slide';

// Transition of components/dialogs
export const Transition = forwardRef(
  (props, ref) =>
    <Slide direction="up" ref={ref} {...props} />
);
