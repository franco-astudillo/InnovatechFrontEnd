import React from 'react';
import { useLoginViewModel } from '../../viewmodels/useLoginViewModel';

const LoginView = () => {
  const { 
    email, setEmail, 
    password, setPassword, 
    error, isLoading, handleLogin 
  } = useLoginViewModel();

  return (
    <div style={styles.container}>
      <form onSubmit={handleLogin} style={styles.form}>
        <h2>Innovatech Solutions</h2>
        <p>Inicia sesión en la plataforma</p>
        
        {error && <div style={styles.error}>{error}</div>}

        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={styles.input}
          required
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={styles.input}
          required
        />
        
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Iniciando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

// Estilos básicos (luego puedes pasar a React Bootstrap o CSS Modules)
const styles = {
  container: { display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f7f6' },
  form: { padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '350px', display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
  button: { padding: '10px', background: '#2c3e50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  error: { color: 'red', fontSize: '14px', textAlign: 'center' }
};

export default LoginView;