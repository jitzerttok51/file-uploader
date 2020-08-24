import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { ProgressBar } from "react-bootstrap"
import { NotifyAction } from './reducers/notifyReducer';
import Axios from 'axios';
import { FetchFiles } from './reducers/fileReducer';

export default function FileUpload() {

    const [file, setFile] = useState(new File([], ""));
    const [filename, setFilename] = useState('Chose file');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);


    const onBrowse = (e: React.FormEvent<HTMLInputElement>) => {
        if(e.currentTarget.files) {
            const file = e.currentTarget.files[0];
            setFile(file);
            setFilename(file.name);
        }
    };

    const dispatch = useDispatch();

    const onUpload = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const btn = e.currentTarget;
        try {
            e.preventDefault();
            btn.disabled = true;
            setLoading(true);
            const data = new FormData();
            data.append("file", file);
            const response = await Axios.post("/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: progress => {
                    setProgress((progress.loaded/progress.total)*100);
                }
            });
            console.log(response.request);
            const success = response.data as string;
            dispatch(NotifyAction(success));
            dispatch(FetchFiles());
        } catch (err) {
            const e = err as Error;
            dispatch(NotifyAction(e.message));
        } finally {
            setLoading(false);
            btn.disabled = false;
        }
        
    }

    return (
        <>
            <form>
                <div className="custom-file mt-5">
                    <input type="file" className="custom-file-input form-control-lg d-inline-block" id="customFile" onChange={onBrowse}/>
                    <label className="custom-file-label form-control-lg d-inline-block" htmlFor="customFile">{filename}</label>
                    <button type="submit" value="Upload" className="btn btn-primary btn-block" onClick={onUpload}>Upload</button>
                    { loading ? (
                        <ProgressBar striped animated variant="success" now={progress} label={
                            progress.toFixed()+"%"
                        }/>
                    ) : (
                        ""
                    )}
                </div>
            </form>
        </>
    )
}