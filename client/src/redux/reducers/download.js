import {
  DOWNLOAD_ALBUM_DONE,
  DOWNLOAD_ALBUM_ERROR,
  DOWNLOAD_ALBUM_START,
  DOWNLOAD_PICTURE_DONE,
  DOWNLOAD_PICTURE_ERROR,
  DOWNLOAD_PICTURE_START,
  DOWNLOAD_REQ_DONE,
  DOWNLOAD_REQ_ERROR,
  DOWNLOAD_REQ_START,
  DOWNLOAD_SET_DONE,
  DOWNLOAD_SET_ERROR,
  DOWNLOAD_SET_INDOWNLOAD,
  DOWNLOAD_SET_START,
  DOWNLOAD_STATUS_DONE,
  LOGOUT
} from '../constants/actionTypes';

const initialDownload = { inDownload: false, statuses: {}, WIP: false, error: false, pictureId: 0, albumId: 0, downloads: [], download: null, derror: null };

const reducer = (download = initialDownload, action) => {
  switch (action.type) {
    // request to download a picture
  case DOWNLOAD_PICTURE_START:
    return {
      ...download,
      WIP: true,
      error: false
    };
  case DOWNLOAD_PICTURE_DONE:
    const { pictureId } = action.payload;
    return {
      ...download,
      WIP: false,
      error: false,
      pictureId,
    };
  case DOWNLOAD_PICTURE_ERROR:
    return {
      ...download,
      WIP: false,
      error: action.payload.message,
    };

    // request to download a album
  case DOWNLOAD_ALBUM_START:
    return {
      ...download,
      WIP: true,
      error: false
    };
  case DOWNLOAD_ALBUM_DONE:
    const { albumId } = action.payload;
    return {
      ...download,
      WIP: false,
      error: false,
      albumId,
    };
  case DOWNLOAD_ALBUM_ERROR:
    return {
      ...download,
      WIP: false,
      error: action.payload.message,
    };

    // get a list of requests to download a picture
  case DOWNLOAD_REQ_START:
    return {
      ...download,
      WIP: true,
      error: false,
    };
  case DOWNLOAD_REQ_DONE:
    return {
      ...download,
      WIP: false,
      error: false,
      downloads: action.payload.data,
    };
  case DOWNLOAD_REQ_ERROR:
    return {
      ...download,
      WIP: false,
      error: action.payload.message,
    };

    // Permit or Decline request to download a picture
  case DOWNLOAD_SET_START:
    return {
      ...download,
      WIP: true,
      derror: false,
      download: action.payload.id,
    };
  case DOWNLOAD_SET_DONE:
    const { id }    = action.payload;
    const downloads = [...download.downloads.filter((d) => d.id !== id)];
    return {
      ...download,
      WIP: false,
      derror: false,
      download: null,
      downloads,
    };
  case DOWNLOAD_SET_ERROR:
    return {
      ...download,
      WIP: false,
      derror: action.payload.message,
    };

  case DOWNLOAD_STATUS_DONE:
    const statuses =
            action.payload.data.reduce((map, obj) => {
              map[obj.picture_id] = obj.status;
              return map;
            }, {});
    return {
      ...download,
      statuses,
    };

  case DOWNLOAD_SET_INDOWNLOAD:
    return { ...download, inDownload: action.payload };

  case LOGOUT:
    return initialDownload;

  default:
    return download;
  }
};

export default reducer;
