import {Route, BrowserRouter} from 'react-router-dom'
import React from 'react'

import Home from './pages/home'
import Point from './pages/createPoint'
const Routes = () => {

  return (

    <BrowserRouter>
    <Route component = {Home} path = "/"exact />
    <Route component = {Point} path = "/cadastro"/>
  </BrowserRouter>
  );
  
}
export default Routes
