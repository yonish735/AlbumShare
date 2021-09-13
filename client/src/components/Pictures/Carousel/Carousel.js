import React from 'react';
import PropTypes, { arrayOf } from 'prop-types';
import ImageGallery from 'react-image-gallery';
import clsx from 'clsx';

import 'react-image-gallery/styles/css/image-gallery.css';

import { pictureShape } from '../../shared/shapes';
import pictureDefault from '../../../images/album-default.png';

import useStyles from './styles';

const renderItem = ({ original, originalAlt, originalTitle, height, width }, classes) => {
  return (
    <div className={classes.item}>
      <img
        className="image-gallery-image"
        src={original}
        alt={originalAlt}
        height={height}
        width={width}
        title={originalTitle}
      />
      <span className={clsx('image-gallery-description', classes.title)}>{originalTitle}</span>
    </div>
  );
};

// Display pictures as a carousel. Start with one with the given ID
const Carousel = ({ slides, pictureId }) => {
  const classes = useStyles();

  // Map pictures to an array of images for ImageGallery
  const images     = slides.map(({ image, title, description }) => {
    // Fetch width and height of a picture
    const img               = new Image();
    img.src                 = image;
    const { width, height } = img;

    return {
      original: image || pictureDefault,
      height,
      width,
      originalAlt: title,
      originalTitle: title,
      description,
    };
  });
  const startIndex = slides.findIndex((slide) => slide.id === pictureId);

  return (
    <ImageGallery
      items={images}
      showThumbnails={false}
      showBullets={true}
      showIndex={true}
      startIndex={startIndex}
      showPlayButton={false}
      renderItem={(item) => renderItem(item, classes)}
      showFullscreenButton={false}
      additionalClass={classes.index}
    />
  );
};

Carousel.propTypes = {
  slides: arrayOf(pictureShape).isRequired,
  pictureId: PropTypes.number.isRequired,
};

export default Carousel;
