import React from 'react';

export const ThemeContext = React.createContext(false);

export async function uploadFile(file: File, filename: string) {
    const data = new FormData();
    data.append("file", file, filename);

    try {
        const response = await fetch('/upload', {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            },
            body: data
        });
    } catch (err) {

    }
}