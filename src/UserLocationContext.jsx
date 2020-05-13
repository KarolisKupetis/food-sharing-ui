import React from 'react';
import {createContext} from 'react';

  export const UserLocationContext = createContext({lng: null, lat: null})

export default UserLocationContext;