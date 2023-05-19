import React, {useEffect, useState} from 'react';
import {Routes, Route} from 'react-router-dom'
import { NavBar } from './components/nav-bar';
import { Agrume, Poivre } from './pages';

function App() {

  return (
    <div className="bg-[#FFFFFF] min-h-screen">
     <Routes >
      <Route path='/' element={<NavBar/>}>
        <Route index element={<Agrume/>}/>
        <Route path='/poivre' element={<Poivre/>}/>
      </Route>
     </Routes>
    </div>
  );
}

export default App;
