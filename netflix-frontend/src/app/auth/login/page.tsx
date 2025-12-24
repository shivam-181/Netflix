'use client';
import { useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

const Card = styled.div`
  background: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  padding: 60px 68px 40px;
  min-width: 450px;
  min-height: 500px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 28px;
`;

const Input = styled.input`
  width: 100%;
  background: #333;
  border: none;
  border-radius: 4px;
  color: white;
  height: 50px;
  padding: 16px 20px;
  margin-bottom: 16px;
  font-size: 1rem;
  
  &:focus {
    background: #454545;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  background: var(--netflix-red);
  color: white;
  border: none;
  border-radius: 4px;
  height: 48px;
  font-size: 1rem;
  font-weight: 700;
  margin-top: 24px;
  margin-bottom: 12px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  background: #e87c03;
  border-radius: 4px;
  font-size: 14px;
  padding: 10px 20px;
  margin-bottom: 16px;
`;

const SignUpText = styled.p`
  color: #737373;
  margin-top: 16px;
  font-size: 16px;
  
  a {
    color: white;
    &:hover { text-decoration: underline; }
  }
`;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // If successful, redirect to Profile Selection
      router.push('/profiles'); 
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <Card>
      <Title>Sign In</Title>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      
      <form onSubmit={handleSubmit}>
        <Input 
          type="email" 
          placeholder="Email or phone number" 
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
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <SignUpText>
        New to Netflix? <Link href="/auth/signup">Sign up now</Link>.
      </SignUpText>
    </Card>
  );
}