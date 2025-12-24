'use client';
import { useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

// Reuse styled components (in a real app, move these to src/components/auth/AuthStyles.ts)
const Card = styled.div`
  background: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  padding: 60px 68px 40px;
  min-width: 450px;
`;

const Title = styled.h1` font-size: 2rem; margin-bottom: 28px; `;
const Input = styled.input` 
  width: 100%; background: #333; border: none; border-radius: 4px; 
  color: white; height: 50px; padding: 16px; margin-bottom: 16px; 
`;
const Button = styled.button` 
  width: 100%; background: var(--netflix-red); color: white; border: none; 
  height: 48px; font-weight: 700; margin-top: 24px; cursor: pointer;
`;
const ErrorMsg = styled.div` background: #e87c03; padding: 10px; margin-bottom: 10px; border-radius: 4px; `;

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(email, password);
      // Redirect to login after successful signup
      alert('Account created! Please sign in.');
      router.push('/auth/login');
    } catch (err) {
      // Error handled by store
    }
  };

  return (
    <Card>
      <Title>Sign Up</Title>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      
      <form onSubmit={handleSubmit}>
        <Input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
      
      <p style={{ marginTop: '16px', color: '#737373' }}>
        Already have an account? <Link href="/auth/login" style={{color:'white'}}>Sign in</Link>.
      </p>
    </Card>
  );
}