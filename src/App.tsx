import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Circle, Layer, Rect, Stage } from 'react-konva';
import EditorPage from './pages/editorPage';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import PdfEditor from './pages/pdfeditor/pdfeditor';
import HomePage from './pages/homePage';

export const App = () => {
  return (

    <div className=' fixed inset-0 flex items-center justify-center overflow-auto'>
      <BrowserRouter>
        
        <Routes>
          <Route index element={<HomePage/>}/>
          <Route path='/imageEditor' element={<EditorPage />} ></Route>
          <Route path='/pdfEditor' element={<PdfEditor />}></Route>
        </Routes>
      </BrowserRouter>
    </div>

  );
}

export default App;
