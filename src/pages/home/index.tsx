import React, { Component } from 'react'
import logo from '../../assets/logo.svg'
import {Link} from 'react-router-dom'

import './styles.css'

import {FiLogIn} from 'react-icons/fi'

const Home = () => {
      return (
        <div id ="page-home"> 
          <div className="content">
              <header>
              <img src={logo} alt = "ecoleta"/> 
              </header>

              <main>
                <h1>Seu marketplace de coleta de resíduos.</h1>
                <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>
                
                <Link to= "/cadastro" >
                  <span>
                     <FiLogIn/>
                  </span>
                  <strong>Pesquisar pontos de coleta</strong>
                </Link>

              </main>
              
          </div>
        </div>
      );
    }
export default Home