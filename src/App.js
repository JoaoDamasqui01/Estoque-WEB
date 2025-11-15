// src/App.jsx - VERSÃO CORRETA (SEM API)
import React, { useState } from 'react';
import Home from './tela/Home/Home';
import Formulario from './tela/Formulario/Formulario';
import './App.css';

export default function App() {
    const [currentScreen, setCurrentScreen] = useState('Home');
    const [routeParams, setRouteParams] = useState({});

    const handleNavigate = (screenName, params = {}) => {
        setCurrentScreen(screenName);
        setRouteParams(params);
    };

    return (
        <div className="app">
            {currentScreen === 'Home' && (
                <Home onNavigate={handleNavigate} />
            )}
            {currentScreen === 'Formulario' && (
                <Formulario 
                    routeParams={routeParams} 
                    onNavigate={handleNavigate} 
                />
            )}
        </div>
    );
}