import PropTypes from 'prop-types';

// Description of properties of picture and album
export const pictureShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  filename: PropTypes.string,
  image: PropTypes.string,
});

export const albumShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  user_id: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  filename: PropTypes.string,
  image: PropTypes.string,
  private: PropTypes.bool.isRequired,
  pictures: PropTypes.arrayOf(pictureShape),
});
