import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock, FiPhone } from 'react-icons/fi';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const { login, register, socialLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await socialLogin(credentialResponse.credential, 'google');
      navigate('/profil');
    } catch (err) {
      setError('Erreur connexion Google');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.name, formData.email, formData.password, formData.phone);
      }
      navigate('/profil');
    } catch (err) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    }
  };

  return (
    <section style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
      <div className="glass-card" style={{ maxWidth: '400px', width: '100%', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--gold-400)' }}>
          {isLogin ? 'Connexion' : 'Créer un compte'}
        </h2>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label"><FiUser /> Nom complet</label>
              <input type="text" required className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label"><FiMail /> Email</label>
            <input type="email" required className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          
          <div className="form-group">
            <label className="form-label"><FiLock /> Mot de passe</label>
            <input type="password" required className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label"><FiPhone /> Téléphone</label>
              <input type="text" className="form-input" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', justifyContent: 'center' }}>
            {isLogin ? 'Se connecter' : 'S\'inscrire'}
          </button>
        </form>

        <div style={{ margin: '2rem 0', display: 'flex', alignItems: 'center', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ padding: '0 10px', fontSize: '0.85rem' }}>OU CONTINUER AVEC</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="filled_black"
                shape="pill"
                width="100%"
              />
            </div>
          </GoogleOAuthProvider>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
          {isLogin ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?"}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--gold-400)', cursor: 'pointer', marginLeft: '0.5rem', fontWeight: 'bold' }}>
            {isLogin ? "S'inscrire" : "Se connecter"}
          </button>
        </p>
      </div>
    </section>
  );
}
