import React from 'react';
import { get_notes } from '../api/note_api';
import { user_login, user_signup } from '../api/user_api';
import { useAppDispatch } from '../context';
import { Spinner } from './Spinner';

const Signup = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirm, setPasswordConfirm] = React.useState('');
  const [email, setEmail] = React.useState('');

  const [waiting, setWaiting] = React.useState(false);

  const submit = React.useCallback(
    (event: any) => {
      // TODO use email
      const success = () => {
        const loginSucces = () => {
          get_notes(dispatch);
          setWaiting(false);
        };
        user_login({ name: username, password: password }, loginSucces);
      };
      setWaiting(true);
      user_signup({ name: username, password: password }, success);

      event.preventDefault();
    },
    [dispatch, username, password, waiting]
  );

  const passwordMatch: boolean =
    password === passwordConfirm && password !== '';
  const passwordNoMatch: boolean =
    password !== passwordConfirm && (password !== '' || passwordConfirm !== '');

  const submitDisabled = !passwordMatch || !username;

  return (
    <div className="mt-12">
      <form className="grid grid-cols-1 gap-6" onSubmit={submit}>
        <label className="block">
          <span className="text-gray-700 text-sm">Username</span>
          <input
            type="text"
            className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-400 placeholder-gray-400"
            placeholder="Choose a username"
            value={username}
            onChange={(event) => setUsername(event?.target?.value)}
          />
        </label>
        <label className="block">
          <span className="text-gray-700 text-sm">Password</span>
          <input
            type="password"
            className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-400 placeholder-gray-400"
            placeholder="Enter your password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event?.target?.value)}
          />
        </label>
        <label className="block">
          <span className="text-gray-700 text-sm">Confirm Password</span>
          <div className="relative">
            <input
              type="password"
              className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-400 placeholder-gray-400"
              placeholder="Confirm your password"
              autoComplete="new-password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event?.target?.value)}
            />
            {passwordMatch && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                strokeWidth="2"
                className="fill-current text-green-500 absolute top-3 right-3"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm4.768 9.14a1 1 0 1 0-1.536-1.28l-4.3 5.159-2.225-2.226a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.475-.067l5-6z"
                />
              </svg>
            )}
            {passwordNoMatch && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                strokeWidth="2"
                className="fill-current text-red-500 absolute top-3 right-3"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm3.707 8.707a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293a1 1 0 1 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293z"
                />
              </svg>
            )}
          </div>
        </label>
        <label className="block mt-4">
          <span className="text-gray-500 text-sm">
            Email address (optional)
          </span>
          <input
            type="email"
            className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-gray-400 placeholder-gray-400"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event?.target?.value)}
          />
        </label>
        <button
          type="submit"
          disabled={submitDisabled}
          className="w-full py-3 mt-10 bg-gray-800 disabled:bg-gray-400 rounded-md
                    font-medium text-white uppercase
                    focus:outline-none hover:bg-gray-700 hover:shadow-none"
        >
          <div className="relative">
            <span>Create account</span>
            {waiting && (
              <span className="absolute pl-2">
                <Spinner />
              </span>
            )}
          </div>
        </button>
      </form>
    </div>
  );
};

export default Signup;
