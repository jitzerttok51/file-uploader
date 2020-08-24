import { ThunkAction } from "redux-thunk"
import { Action } from "redux"
import { NotifyAction } from "./notifyReducer";

export interface StoredFile {
    name: string;
    uri: string;
    localId: number;
}

export type Storage = StoredFile[];
const FETCH_FILES = "FETCH_FILES";
const DOWNLOAD_FILE = "DOWNLOAD_FILE";

export interface FetchFilesAction {
    type: typeof FETCH_FILES
    files: StoredFile[];
}

export interface DownloadFileAction {
    type: typeof DOWNLOAD_FILE
}

type ThunkResult<T extends Action> = ThunkAction<Promise<T>, StoredFile, undefined, T>

let id = 0;
const nextId = () => {
    const oldId = id;
    id+=1
    return oldId;
}

export function FetchFiles(): ThunkResult<FetchFilesAction | ReturnType<typeof NotifyAction>> {
    return async dispatch => {
        const response = await fetch('/uploads');
        const data = (await response.json()) as string[];
        const files = data.map(uri=>{
            const i = uri.lastIndexOf("/");
            const name = uri.substring(i+1);
            return { name, uri, localId: nextId() }
        });
        dispatch(NotifyAction("Success "));
        return dispatch({
            type: FETCH_FILES,
            files
        });
    };
}

export function DownloadFile(storedFile: StoredFile): ThunkResult<DownloadFileAction | ReturnType<typeof NotifyAction>> {
    return async dispatch => {
        try {
            const response = await fetch(storedFile.uri);
            const blob = await response.blob();
            const a = document.createElement("a");
            a.style.display = "none";
            a.href =  window.URL.createObjectURL(blob);
            a.setAttribute("download", storedFile.name);
            a.click();
            window.URL.revokeObjectURL(a.href);
        } catch(err) {
            const ex:Error = err;
            dispatch(NotifyAction(ex.message));
        }

        return dispatch({type: DOWNLOAD_FILE});
    };
}

type Actions = FetchFilesAction;

export default function StoredFilesReducer(state: Storage = [], action: Actions): Storage {
    switch(action.type) {
        case FETCH_FILES: return action.files;
        default: return state;
    }
}

