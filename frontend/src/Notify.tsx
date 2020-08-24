import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux"
import { AppState } from "./config/StoreConfig";
import { Notifications, DeNotifyAction } from "./reducers/notifyReducer";


export default function Notify() {

    const notifications: Notifications = useSelector((state: AppState) => state.notifications);
    const dispatch = useDispatch();

    const removeNotify = (id: number) => {
        const timeout = setTimeout(()=>{
            dispatch(DeNotifyAction(id));
            clearTimeout(timeout);
        }, 5000);
    };

    return (
        <>
            {
                notifications.map(n=>{
                    removeNotify(n.id)
                    return n
                }).reverse().map(n=>(
                <div className="alert alert-success" role="alert" key={n.id}>
                    { n.label }
                </div>
                ))
            }
        </>
    );
}