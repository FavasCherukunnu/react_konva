import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Circle, Layer, Rect, Stage } from 'react-konva';
import EditorPage from './pages/editorPage';

export const App = () => {
  return (
    
    <div className=' fixed inset-0 flex items-center justify-center overflow-auto'>
      <EditorPage/>
    </div>

  );
}

export default App;
