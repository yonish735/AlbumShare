import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import PhotoCameraOutlined from '@material-ui/icons/PhotoCameraOutlined';
import Alert from '@material-ui/lab/Alert';

import useStyles from './styles';

// Handle selection of an image from disk
const FileBase = ({ fileName, setFileName, accept = 'image/*', onDone }) => {
  const [open, setOpen] = React.useState(false);
  const [message, setMessege] = React.useState('Max size of an image is 500kB');
  const classes         = useStyles();

  // New file was selected
  const onChange = (e) => {
    setOpen(false);

    const files = e.target.files;
    if (files.length === 0) {
      setFileName('');
      return;
    }

    // No support for multiple files selection
    const file = files[0];
    const size = Math.round(file.size / 1024);

    // Max size of picture
    if (size > 500) {
      setOpen(true);
      setMessege('Max size of an image is 500kB')
      setFileName('');
      return;
    }

    // Picture can only be jpg, jpeg, svg and png
    if (!file.name.match(/.(jpg|jpeg|png|svg)$/i)) {
      setOpen(true);
      setMessege('Picture can be only in format jpg, jpeg, svg or png')
      setFileName('');
      return;
    }

    // Convert the file to base64 text
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

      // Make a fileInfo Object
      const fileInfo = {
        name: file.name,
        type: file.type,
        size: size + ' kB',
        base64: reader.result,
        file: file,
      };
      setFileName(file.name);
      // Apply Callback function
      onDone(fileInfo);
    };
  };

  return (
    <>
      <div className={classes.root}>
        <input
          id="icon-button-file"
          type="file"
          className={classes.fileInput}
          accept={accept}
          multiple={false}
          onChange={onChange}
        />
        <label htmlFor="icon-button-file" className={classes.label}>
          <IconButton color="primary" aria-label="upload picture" component="span">
            {fileName === '' ? <PhotoCameraOutlined /> : <PhotoCamera />}
          </IconButton>
          <span>{fileName}</span>
          {open && (
            <Alert className={classes.alert} severity="error">
              {message}
            </Alert>
          )}
        </label>
      </div>
    </>
  );
};

FileBase.propTypes = {
  onDone: PropTypes.func.isRequired,
  fileName: PropTypes.string.isRequired,
  setFileName: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
};

export default FileBase;
