import React from 'react';
import '../styles/App.css';
import FileUpload from "./FileUpload";
import Notify from "./Notify";
import { store } from '../config/StoreConfig';
import { Provider } from "react-redux"
import FilesList from './FilesList';

export default function App() {
  return (
    <Provider store={store}>
    <div className="container">
      <div className="container" style={{"position": "absolute"}}>
        <Notify/>
      </div>
      
      <h4 className="display-4 text-center mb-4 mt-4">
           <i className="fab fa-react"/> React File Upload
      </h4>
        <FileUpload/>
        <FilesList/>
    </div>
    </Provider>
  );
}