import { StoredFile } from "./reducers/fileReducer";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { NotifyAction } from "./reducers/notifyReducer";
import axios from "axios";


export default function DownloadButton(props: {file: StoredFile}) {
    
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    const dispatch = useDispatch();

    const download = async (e:  React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const btn =e.currentTarget;
        btn.disabled = true;
        setLoading(true);
        setProgress(0);
        try {
            const response = await axios.get(props.file.uri, {
                onDownloadProgress: progress => {
                    setProgress((progress.loaded/progress.total)*100);
                }
            });
            setProgress(100);
            const blob = new Blob([response.data]);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href =  window.URL.createObjectURL(blob);
            a.setAttribute("download", props.file.name);
            a.click();
            window.URL.revokeObjectURL(a.href);
        } catch (err) {
            const e = err as Error;
            dispatch(NotifyAction(e.message));
        }
        btn.disabled = false;
        setLoading(false);
    }

    return(
        <button className="btn btn-primary float-right" onClick={download}>
            {!loading ? (
                "Download"
            ) : (
                <span className="spinner-border" role="status"></span>
            )}
            <span>{loading ? "  "+progress.toFixed()+"%" : ""}</span>
        </button>
    )
}