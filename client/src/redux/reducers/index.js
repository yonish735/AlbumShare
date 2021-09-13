import { combineReducers } from 'redux';

import albums from './albums';
import pictures from './pictures';
import download from './download';
import auth from './auth';
import filter from './filter';

export const reducers = combineReducers({ albums, pictures, download, auth, filter });
