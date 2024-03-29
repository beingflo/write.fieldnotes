import {
  SignupCredentials,
  UserCredentials,
  UserCredentialsPasswordChange,
  UserInfo,
} from '../types';
import { mapError, handleException } from './index';

const API_URL = import.meta.env.VITE_API_URL;
const USER_URL = `${API_URL}/user`;
const SESSION_URL = `${API_URL}/session`;
const INVALIDATE_SESSIONS_URL = `${API_URL}/allsessions`;

export const user_login = (credentials: UserCredentials): Promise<void> => {
  return fetch(SESSION_URL, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then(mapError);
};

export const user_logout = (
  onSuccess: (res: Response) => void = () => undefined,
  onFailure: any = handleException
): void => {
  fetch(SESSION_URL, {
    credentials: 'include',
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(mapError)
    .then(onSuccess)
    .catch(onFailure);
};

export const user_signup = (credentials: SignupCredentials): Promise<void> => {
  return fetch(USER_URL, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then(mapError);
};

export const user_delete = (credentials: UserCredentials): Promise<void> => {
  return fetch(USER_URL, {
    credentials: 'include',
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then(mapError);
};

export const user_password_change = (
  credentials: UserCredentialsPasswordChange
): Promise<void> => {
  return fetch(USER_URL, {
    credentials: 'include',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then(mapError);
};

export const user_info = (): Promise<UserInfo> => {
  return fetch(`${USER_URL}/info`, {
    credentials: 'include',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(mapError)
    .then((response) => response.json());
};

export const user_salt = (
  salt: string,
  onSuccess: (res: Response) => void = () => undefined,
  onFailure: any = handleException
): void => {
  fetch(`${USER_URL}/salt`, {
    credentials: 'include',
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ salt }),
  })
    .then(mapError)
    .then(onSuccess)
    .catch(onFailure);
};

export const invalidate_sessions = (
  credentials: UserCredentials
): Promise<void> => {
  return fetch(INVALIDATE_SESSIONS_URL, {
    credentials: 'include',
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then(mapError);
};
