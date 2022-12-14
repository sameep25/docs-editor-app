import './App.css';
import {BrowserRouter , Routes ,Route, Navigate} from "react-router-dom" ;
import { v4 as uuid } from "uuid" ;

import Editor from './components/Editor';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate replace to={`/docs/${uuid()}`} /> } />
        <Route path='/docs/:id' element={<Editor/> } />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
