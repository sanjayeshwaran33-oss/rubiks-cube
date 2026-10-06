import React, { useState } from 'react';
import { Eye, EyeOff, Film, ShieldCheck, Zap, ArrowRight, UserCheck } from 'lucide-react';
import { loginUser, registerUser } from '../services/api';
import { playTaDum, playClickSound } from '../services/sound';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('coder@orkestrim.ac.in');
  const [password, setPassword] = useState('orkestrim2026');
  const [username, setUsername] = useState('The Coder');
  const [college, setCollege] = useState('SRM Valliammai Engineering College');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    playClickSound();

    try {
      let res;
      if (isRegister) {
        res = await registerUser({ username, email, password, college });
      } else {
        res = await loginUser({ email, password });
      }
      playTaDum();
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestEntry = () => {
    playTaDum();
    const guestUser = {
      id: 'guest_' + Date.now(),
      username: 'Guest Spectator',
      email: 'spectator@orkestrim.ac.in',
      avatar: '/assets/avatar-spectator.png',
      token: 'mock_guest_token'
    };
    onLoginSuccess(guestUser);
  };

  return (
    <div 
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#000000',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.85)), url('/assets/hero-backdrop.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Top Header */}
      <header style={{
        padding: '1.8rem 3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: '#E50914',
            color: '#fff',
            fontWeight: 900,
            fontSize: '1.5rem',
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Montserrat', sans-serif",
            boxShadow: '0 0 15px rgba(229, 9, 20, 0.6)'
          }}>
            N
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontFamily: "'Bebas Neue', sans-serif", 
              fontSize: '2.5rem', 
              color: '#E50914', 
              letterSpacing: '2px',
              lineHeight: 0.9,
              textShadow: '0 0 12px rgba(229, 9, 20, 0.4)'
            }}>
              ORKESTRIM
            </span>
            <span style={{ fontSize: '0.65rem', letterSpacing: '2.5px', color: '#aaa', fontWeight: 700 }}>
              2K26 SYMPOSIUM STREAM
            </span>
          </div>
        </div>

        <button
          onClick={handleGuestEntry}
          className="btn-secondary"
          style={{
            fontSize: '0.85rem',
            padding: '0.5rem 1.2rem',
            backgroundColor: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          <Zap size={16} color="#ffd700" />
          Quick Guest Access
        </button>
      </header>

      {/* Main Center Login Card */}
      <main style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        zIndex: 10
      }}>
        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.78)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '450px',
          padding: '3.5rem 4rem 3rem 4rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#fff',
            marginBottom: '1.8rem',
            fontFamily: "'Montserrat', sans-serif"
          }}>
            {isRegister ? 'Register Stream Pass' : 'Sign In'}
          </h1>

          {error && (
            <div style={{
              backgroundColor: '#e87c03',
              color: '#fff',
              padding: '0.75rem 1rem',
              borderRadius: '4px',
              fontSize: '0.85rem',
              marginBottom: '1.2rem',
              lineHeight: 1.3
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {isRegister && (
              <>
                <div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Full Name / Squad Handle"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      backgroundColor: '#333333',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="College / Department"
                    style={{
                      width: '100%',
                      padding: '1rem',
                      backgroundColor: '#333333',
                      border: '1px solid #444',
                      borderRadius: '4px',
                      color: '#fff',
                      fontSize: '0.95rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </>
            )}

            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or phone number"
                style={{
                  width: '100%',
                  padding: '1rem',
                  backgroundColor: '#333333',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  width: '100%',
                  padding: '1rem 3rem 1rem 1rem',
                  backgroundColor: '#333333',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8c8c8c',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-red"
              style={{
                width: '100%',
                padding: '0.9rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                marginTop: '0.8rem',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Authenticating...' : isRegister ? 'Get Delegate Pass' : 'Sign In'}
            </button>

            {/* Quick Guest Pass Option */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', margin: '0.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontSize: '0.75rem', color: '#8c8c8c', fontWeight: 600 }}>OR</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            </div>

            <button
              type="button"
              onClick={handleGuestEntry}
              style={{
                width: '100%',
                padding: '0.8rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              <UserCheck size={18} color="#46d369" />
              <span>Instant Pass / Guest Spectator</span>
            </button>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#b3b3b3', marginTop: '0.4rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: '#E50914' }}
                />
                Remember me
              </label>
              <a href="#help" style={{ color: '#b3b3b3', textDecoration: 'none' }}>
                Need help?
              </a>
            </div>

            <div style={{ marginTop: '1.2rem', fontSize: '0.95rem', color: '#737373' }}>
              {isRegister ? 'Already registered for Orkestrim?' : 'New to Orkestrim 2K26?'}{' '}
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsRegister(!isRegister);
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  textDecoration: 'underline'
                }}
              >
                {isRegister ? 'Sign in now.' : 'Sign up now.'}
              </button>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#8c8c8c', lineHeight: 1.4, marginTop: '0.5rem' }}>
              This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
              <span style={{ color: '#0071eb', cursor: 'pointer' }}>Learn more.</span>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem 3rem',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#737373',
        fontSize: '0.8rem',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '1rem',
        zIndex: 10
      }}>
        <div>Questions? Call +91 98401 23456 (Symposium Secretariat)</div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span>SRM VEC Engineering College</span>
          <span>Terms of Use</span>
          <span>Privacy & Rules</span>
          <span>Cookie Preferences</span>
        </div>
      </footer>
    </div>
  );
}
