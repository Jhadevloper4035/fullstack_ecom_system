'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token');
    }
  }, [token]);

  const passwordRules = useMemo(() => ({
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[^A-Za-z\d]/.test(password),
  }), [password]);

  const allRulesMet = Object.values(passwordRules).every(Boolean);

  const validatePassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters long';
    if (!/[a-z]/.test(pwd)) return 'Password must contain a lowercase letter';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain an uppercase letter';
    if (!/\d/.test(pwd)) return 'Password must contain a number';
    if (!/[^A-Za-z\d]/.test(pwd)) return 'Password must contain a special character';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token, password, confirmPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
          Reset Password
        </h1>

        {success ? (
          <div style={{
            padding: '15px',
            background: '#d4edda',
            color: '#155724',
            borderRadius: '5px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            Password reset successful! Redirecting to login...
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '15px',
                background: '#f8d7da',
                color: '#721c24',
                borderRadius: '5px',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="Enter new password"
              />

              {password.length > 0 && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px 12px',
                  background: '#f9fafb',
                  border: '1px solid #eee',
                  borderRadius: '6px',
                  minHeight: '110px',
                  fontSize: '13px'
                }}>
                  {[
                    { label: 'At least 8 characters', ok: passwordRules.minLength },
                    { label: 'One uppercase letter', ok: passwordRules.hasUppercase },
                    { label: 'One lowercase letter', ok: passwordRules.hasLowercase },
                    { label: 'One number', ok: passwordRules.hasNumber },
                    { label: 'One special character', ok: passwordRules.hasSpecialChar },
                  ].map((rule, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                        color: rule.ok ? '#2f855a' : '#6b7280'
                      }}
                    >
                      <span style={{ width: '16px', textAlign: 'center', fontWeight: 'bold' }}>
                        {rule.ok ? '✔' : '–'}
                      </span>
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '16px'
                }}
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !allRulesMet || password !== confirmPassword}
              style={{
                width: '100%',
                padding: '14px',
                background:
                  loading || !allRulesMet || password !== confirmPassword
                    ? '#999'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor:
                  loading || !allRulesMet || password !== confirmPassword
                    ? 'not-allowed'
                    : 'pointer',
                opacity:
                  loading || !allRulesMet || password !== confirmPassword ? 0.85 : 1,
              }}
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/login" style={{ color: '#667eea', textDecoration: 'none' }}>
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
