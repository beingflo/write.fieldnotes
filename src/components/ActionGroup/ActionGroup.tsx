import { Popover, Transition } from '@headlessui/react';
import React from 'react';
import { user_logout } from '../../api/user_api';
import {
  EyeIcon,
  HomeIcon,
  LinkIcon,
  LogoutIcon,
  MoreIcon,
  SettingsIcon,
} from '../../icons';
import { SaveAction } from './SaveAction';
import { DeleteAction } from './DeleteAction';
import { NewAction } from './NewAction';
import '../../style.css';
import Settings from './Settings/Settings';
import { Sharing } from './Sharing';
import { AuthStatus, Share } from '../../types';
import { useAtom } from 'jotai';
import {
  authState,
  getCurrentNoteState,
  getSharesState,
  getUserInfoState,
} from '../state';

const shareUrl = import.meta.env.VITE_SHARE_URL;

export const ActionGroup = (): React.ReactElement => {
  const [shares] = useAtom(getSharesState);
  const [userInfo] = useAtom(getUserInfoState);
  const [currentNote] = useAtom(getCurrentNoteState);
  const [, setAuthStatus] = useAtom(authState);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showSharing, setShowSharing] = React.useState(false);
  const [isShared, setIsShared] = React.useState(false);
  const [isPublic, setIsPublic] = React.useState(false);

  const userDashboard = `${shareUrl}/${userInfo?.username}`;

  const handleLogout = React.useCallback(() => {
    user_logout(() => setAuthStatus(AuthStatus.SIGNED_OUT));
  }, []);

  React.useEffect(() => {
    const share = shares.find(
      (share: Share) => share?.note === currentNote?.id
    );
    setIsShared(!!share);
  }, [shares, currentNote]);

  React.useEffect(() => {
    const share = shares.find(
      (share: Share) => share?.note === currentNote?.id && share?.public
    );
    setIsPublic(!!share);
  }, [currentNote, shares]);

  return (
    <div className="flex flex-row sm:flex-col space-x-6 sm:space-x-0 sm:space-y-1.5 fixed top-6 right-6">
      <SaveAction />
      <NewAction />
      <DeleteAction />
      <div>
        <button
          onClick={() => setShowSharing(true)}
          disabled={!currentNote}
          className="disabled:opacity-60 relative hover:-translate-x-0.5 transition active:scale-90"
        >
          <LinkIcon
            className={`${
              isShared && 'icon-highlight'
            } h-7 w-7 sm:h-6 sm:w-6 text-black`}
          />
          {isPublic && (
            <EyeIcon className="w-4 h-4 text-green-600 absolute top-4 left-4 sm:top-3.5 sm:left-3.5" />
          )}
        </button>
      </div>
      <Popover className="relative">
        <Popover.Button className="focus:outline-none">
          <div>
            <MoreIcon className="h-7 w-7 sm:h-6 sm:w-6 text-black hover:-translate-x-0.5 transition active:scale-90" />
          </div>
        </Popover.Button>
        <Transition
          enter="transition-opacity ease-linear duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-75"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Panel className="absolute top-8 -left-2 sm:left-0 bg-white border border-gray-800 sm:border-none shadow-lg rounded sm:shadow-none p-2 sm:p-0">
            <div className="space-y-4 sm:space-y-1.5">
              <div>
                <button onClick={() => window.open(userDashboard, '_blank')}>
                  <HomeIcon className="h-7 w-7 sm:h-6 sm:w-6 text-black hover:-translate-x-0.5 transition active:scale-90" />
                </button>
              </div>
              <div>
                <button onClick={() => setShowSettings(true)}>
                  <SettingsIcon className="h-7 w-7 sm:h-6 sm:w-6 text-black hover:-translate-x-0.5 transition active:scale-90" />
                </button>
              </div>
              <div>
                <button onClick={handleLogout}>
                  <LogoutIcon className="h-7 w-7 sm:h-6 sm:w-6 text-black hover:-translate-x-0.5 transition active:scale-90" />
                </button>
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
      {showSettings && (
        <Settings
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />
      )}
      {showSharing && (
        <Sharing showSharing={showSharing} setShowSharing={setShowSharing} />
      )}
    </div>
  );
};

export default ActionGroup;
