import { Action } from "redux"

export interface Notification {
    id: number;
    label: string;
}
export type Notifications = Notification[];
const NOTIFY = "NOTIFY";
const DE_NOTIFY = "DE_NOTIFY";

export interface NotifyAction extends Action<string> {
    type: typeof NOTIFY;
    label: string;
}

export interface DeNotifyAction extends Action<string> {
    type: typeof DE_NOTIFY;
    id: number;
}

export function NotifyAction(label: string): NotifyAction {
    return { type: NOTIFY, label };
}

export function DeNotifyAction(id: number): DeNotifyAction {
    return { type: DE_NOTIFY, id };
}

type Actions = NotifyAction | DeNotifyAction;

let id = 0;
const nextId = () => {
    const oldId = id;
    id+=1
    return oldId;
}

export default function NotifyReducer(state: Notifications = [], action: Actions): Notifications {
    switch(action.type) {
        case NOTIFY: return state.concat({
            id: nextId(),
            label: action.label
        });
        case DE_NOTIFY: return state.filter(n=>n.id!==action.id);
        default: return state;
    }
}

