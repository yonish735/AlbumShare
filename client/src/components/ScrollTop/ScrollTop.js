import React from 'react';
import PropTypes from 'prop-types';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Zoom from '@material-ui/core/Zoom';

import useStyles from './styles';

// Scroll to element with id `back-to-top-anchor`
// Usually to the top of page/container
function ScrollTop({ children }) {
  const classes = useStyles();
  const trigger = useScrollTrigger({ disableHysteresis: true });

  const handleClick = (e) => {
    const anchor = (e.target.ownerDocument || document).querySelector('#back-to-top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.object.isRequired,
};

export default ScrollTop;
