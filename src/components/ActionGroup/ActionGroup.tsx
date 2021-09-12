import { Popover, Transition } from '@headlessui/react';
import React from 'react';
import { user_logout } from '../../api/user_api';
import { LinkIcon, LogoutIcon, MoreIcon, SettingsIcon } from '../../icons';
import { SaveAction } from './SaveAction';
import { DeleteAction } from './DeleteAction';
import { NewAction } from './NewAction';
import '../../style.css';
import Settings from './Settings/Settings';
import { useGetNoteList } from '../../api/hooks';
import { Sharing } from './Sharing';
import { useCurrentNote } from '../../context/currentNoteReducer';
import { useShares } from '../../context/sharesReducer';
import { Share } from '../../types';

export const ActionGroup = (): React.ReactElement => {
  const getNoteList = useGetNoteList();
  const shares = useShares();
  const currentNote = useCurrentNote();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showSharing, setShowSharing] = React.useState(false);
  const [isShared, setIsShared] = React.useState(false);

  const handleLogout = React.useCallback(() => {
    user_logout(() => getNoteList());
  }, []);

  React.useEffect(() => {
    const share = shares.find(
      (share: Share) => share?.note === currentNote?.id
    );
    setIsShared(!!share);
  }, [shares, currentNote]);

  return (
    <div className="space-y-2">
      <SaveAction />
      <NewAction />
      <DeleteAction />
      <Popover className="relative">
        <Popover.Button>
          <MoreIcon className="text-gray-700 hover:-translate-x-0.5 transform transition active:scale-90" />
        </Popover.Button>
        <Transition
          enter="transition-opacity ease-linear duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-75"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Panel className="absolute top-8 left-0">
            <div className="space-y-2">
              <button
                onClick={() => setShowSharing(true)}
                disabled={!currentNote}
                className="disabled:opacity-60 relative hover:-translate-x-0.5 transform transition active:scale-90"
              >
                {isShared && (
                  <span className="absolute bg-yellow-300 w-6 h-2 bottom-0 right-0 rounded-full" />
                )}
                <LinkIcon className="text-gray-700 z-10 relative" />
              </button>
              <button onClick={() => setShowSettings(true)}>
                <SettingsIcon className="text-gray-700 hover:-translate-x-0.5 transform transition active:scale-90" />
              </button>
              <button onClick={handleLogout}>
                <LogoutIcon className="text-gray-700 hover:-translate-x-0.5 transform transition active:scale-90" />
              </button>
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
