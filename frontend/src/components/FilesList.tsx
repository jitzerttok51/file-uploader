import React, { useEffect } from "react"
import { AppState } from "../config/StoreConfig"
import { useSelector, useDispatch } from "react-redux";
import { FetchFiles } from "../reducers/fileReducer";
import DownloadButton from "./DownloadButton";

export default function FilesList() {
    const storage = useSelector((state: AppState) => state.storage);
    const dispatch = useDispatch();

    useEffect(()=>{
        dispatch(FetchFiles());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <ul className="list-group mt-5">
            {
                storage.map(file=>(
                    <li className="list-group-item" key={file.localId}>
                        {file.name}
                        <DownloadButton file={file}/>
                    </li>
                ))
            }
        </ul>
    )
}