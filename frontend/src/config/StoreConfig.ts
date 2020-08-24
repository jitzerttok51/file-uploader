import { combineReducers, createStore, applyMiddleware } from "redux"
import NotifyReducer from "../reducers/notifyReducer";
import thunk from 'redux-thunk'
import StoredFilesReducer from "../reducers/fileReducer";

const RootReducer = combineReducers({
    notifications: NotifyReducer,
    storage: StoredFilesReducer
});
export type AppState = ReturnType<typeof RootReducer>
export const store = createStore(RootReducer, undefined, applyMiddleware(thunk));