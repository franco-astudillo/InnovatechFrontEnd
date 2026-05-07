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
        <div style={styles.header}>
          <h2 style={styles.title}>Innovatech Solutions</h2>
          <p style={styles.subtitle}>Portal de Acceso Corporativo</p>
        </div>
        
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.inputGroup}>
          <label style={styles.label}>Correo electrónico</label>
          <input 
            type="email" 
            placeholder="ejemplo@innovatech.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={styles.input}
            autocomplete = "off"
            required
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label style={styles.label}>Contraseña</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={styles.input}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading} style={styles.button}>
          {isLoading ? 'Autenticando...' : 'Ingresar al sistema'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: { display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', fontFamily: 'system-ui, sans-serif' },
  form: { padding: '40px', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '380px', display: 'flex', flexDirection: 'column', gap: '20px' },
  header: { textAlign: 'center', marginBottom: '10px' },
  title: { margin: '0 0 5px 0', color: '#0F172A', fontSize: '1.5rem', fontWeight: '600' },
  subtitle: { margin: 0, color: '#64748B', fontSize: '0.9rem' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.85rem', fontWeight: '500', color: '#334155' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.95rem', outline: 'none' },
  button: { padding: '12px', background: '#1E3A8A', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', marginTop: '10px' },
  error: { color: '#B91C1C', backgroundColor: '#FEF2F2', padding: '10px', borderRadius: '6px', fontSize: '0.85rem', textAlign: 'center', border: '1px solid #FCA5A5' }
};

export default LoginView;