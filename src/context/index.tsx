import React, { Dispatch } from 'react';
import {
  NoteListReducer,
  NOTE_LIST_ADD_NOTE,
  NOTE_LIST_DELETE_NOTE,
  NOTE_LIST_SET_NOTES,
} from './noteListReducer';
import {
  CurrentNoteReducer,
  CURRENT_NOTE_SET,
  CURRENT_NOTE_UPDATE,
} from './currentNoteReducer';
import { SpinnerReducer, SPINNER_SET_WAITING } from './spinnerReducer';
import { StatusReducer, STATUS_SET_STATUS } from './statusReducer';
import {
  Note,
  NoteListItem,
  NoteStatus,
  Share,
  Status,
  UserInfo,
} from '../types';
import { Editor } from '@tiptap/react';
import { NoteStatusReducer, NOTE_STATUS_SET } from './noteStatusReducer';
import {
  KEYPROMPT_SET_SHOW_KEYPROMPT,
  ShowKeypromptReducer,
} from './showKeypromtReducer';
import { atom } from 'jotai';

export const userInfo = atom<UserInfo | undefined>(undefined);
export const getUserInfo = atom((get) => get(userInfo))

export const sharesState = atom<Array<Share>>([]);
export const getSharesState = atom((get) => get(sharesState))

export const editorState = atom<Editor | null>(null);
export const getEditorState = atom((get) => get(editorState));

export type State = {
  waiting: number;
  noteList: Array<NoteListItem>;
  currentNote: Note | undefined;
  status: Status;
  noteStatus: NoteStatus;
  showKeyprompt: boolean;
};

export type Action = {
  type: string;
  [x: string]: any;
};

export type AppDispatch = Dispatch<Action>;

const initialState: State = {
  waiting: 0,
  noteList: [],
  currentNote: undefined,
  status: Status.OK,
  noteStatus: NoteStatus.SYNCED,
  showKeyprompt: false,
};

export const AppContext = React.createContext<{
  state: State;
  dispatch: AppDispatch;
}>({
  state: initialState,
  dispatch: () => undefined,
});

export const ContextProvider = ({
  children,
}: {
  children: React.ReactElement;
}): React.ReactElement => {
  const actionReducerMapping = React.useMemo(
    () => ({
      [NOTE_LIST_SET_NOTES]: NoteListReducer,
      [NOTE_LIST_ADD_NOTE]: NoteListReducer,
      [NOTE_LIST_DELETE_NOTE]: NoteListReducer,
      [SPINNER_SET_WAITING]: SpinnerReducer,
      [CURRENT_NOTE_SET]: CurrentNoteReducer,
      [CURRENT_NOTE_UPDATE]: CurrentNoteReducer,
      [STATUS_SET_STATUS]: StatusReducer,
      [NOTE_STATUS_SET]: NoteStatusReducer,
      [KEYPROMPT_SET_SHOW_KEYPROMPT]: ShowKeypromptReducer,
    }),
    []
  );

  const [state, dispatch] = React.useReducer((state: State, action: Action) => {
    if (action.type in actionReducerMapping) {
      // @ts-ignore
      const reducer = actionReducerMapping[action.type];

      return reducer(state, action);
    }

    return state;
  }, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = (): State => {
  const { state } = React.useContext(AppContext);
  return state;
};

export const useAppDispatch = (): AppDispatch => {
  const { dispatch } = React.useContext(AppContext);
  return dispatch;
};
