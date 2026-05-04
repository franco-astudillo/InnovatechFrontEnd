// src/App.jsx
    import React from 'react';
    import { useInnovatechViewModel } from './viewmodels/useInnovatechViewModel';
    
    function App() {
        const { mensaje } = useInnovatechViewModel();
    
        return (
            <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
                <h1>Portal Innovatech</h1>
                <p>Estado del servidor backend:</p>
                <h2 style={{ color: '#0056b3' }}>{mensaje}</h2>
            </div>
        );
    }
    
    export default App;