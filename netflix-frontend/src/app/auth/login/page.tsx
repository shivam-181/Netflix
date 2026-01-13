'use client';
import { useState } from 'react';
import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Link from 'next/link';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
  width: 100%;
  padding-bottom: 0; /* Removed gap */
`;

const Card = styled.div`
  background: rgba(0, 0, 0, 0.75);
  border-radius: 4px;
  padding: 60px 68px 40px;
  width: 100%;
  max-width: 500px; /* Increased from 450px */
  min-height: 500px;
  margin-bottom: 90px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 28px;
  color: white;
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
  background: #e50914;
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

const Separator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b3b3b3;
  font-size: 13px;
  margin: 10px 0;
  
  &::before, &::after {
    /* Optional lines if requested, but image just shows "OR" text usually or empty space? 
       Actually user image shows just "OR" centered? No, usually native Netflix has lines.
       But let's stick to text for now based on typical design patterns or simple text. */
     /* content: ''; height: 1px; background: #333; flex: 1; margin: 0 10px; */
  }
`;

const CodeButton = styled.button`
  width: 100%;
  background: rgba(128, 128, 128, 0.4);
  color: white;
  border: none;
  border-radius: 4px;
  height: 40px;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 16px;
  cursor: pointer;
  transition: 0.2s;
  
  &:hover {
    background: rgba(128, 128, 128, 0.6);
  }
`;

const ForgotPassword = styled.a`
  display: block;
  text-align: center;
  color: #b3b3b3;
  font-size: 13px;
  text-decoration: none;
  margin-bottom: 16px;
  cursor: pointer;
  
  &:hover { text-decoration: underline; }
`;

const RememberMeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 13px;
  color: #b3b3b3;
  
  input {
    margin-right: 5px;
    height: 16px; 
    width: 16px;
    accent-color: #b3b3b3; 
  }
`;

const NewToNetflix = styled.div`
  margin-top: 16px;
  color: #737373;
  font-size: 16px;
  
  span {
    color: white;
    cursor: pointer;
    &:hover { text-decoration: underline; }
  }
`;

const RecaptchaText = styled.p`
  margin-top: 14px;
  font-size: 11px; /* Small text */
  color: #8c8c8c;
  line-height: 1.5;
  
  a {
    color: #0071eb;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

const ErrorMsg = styled.div`
  background: #e87c03;
  border-radius: 4px;
  font-size: 14px;
  padding: 10px 20px;
  margin-bottom: 16px;
  color: white;
`;

/* Footer Styles */
const LoginFooter = styled.div`
  background: rgba(0,0,0,0.75);
  width: 100%;
  /* Removed max-width on container to allow full width background */
  padding: 30px 0;
  color: #737373;
  font-size: 13px;
  margin-top: auto;
  border-top: 1px solid #333; /* Optional definition for "regular footer" feel */
`;

const FooterContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 5%;
`;

const FooterTitle = styled.div`
  margin-bottom: 20px;
`;

const FooterLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  
  @media (max-width: 740px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  a {
    color: #737373;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

const LangSelect = styled.select`
  background: #000;
  color: #999;
  border: 1px solid #333;
  padding: 6px 12px;
  border-radius: 2px;
  font-size: 13px;
`;

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Use state for remember me if needed, simplified for now
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      router.push('/profiles'); 
    } catch (err) {
      // Error is handled by store
    }
  };

  return (
    <PageContainer>
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
          
          <Separator>OR</Separator>
          <CodeButton type="button">Use a sign-in code</CodeButton>
          <ForgotPassword href="#">Forgot password?</ForgotPassword>
          
          <RememberMeContainer>
            <input 
              type="checkbox" 
              checked={rememberMe} 
              onChange={(e) => setRememberMe(e.target.checked)} 
            />
            <label>Remember me</label>
          </RememberMeContainer>
        </form>

        <NewToNetflix>
          New to Netflix? <Link href="/auth/signup"><span>Sign up now.</span></Link>
        </NewToNetflix>
        
        <RecaptchaText>
          This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="#">Learn more.</a>
        </RecaptchaText>
      </Card>
      
      {/* Footer Below Modal */}
      <LoginFooter>
        <FooterContent>
          <FooterTitle>Questions? Call 000-800-919-1743 (Toll-Free)</FooterTitle>
          <FooterLinks>
            <a href="#">FAQ</a>
            <a href="#">Help Centre</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy</a>
            <a href="#">Cookie Preferences</a>
            <a href="#">Corporate Information</a>
          </FooterLinks>
          
          <div style={{ marginTop: '10px' }}>
             {/* Simplified Globe Icon + Select */}
             <div style={{ position: 'relative', display: 'inline-block' }}>
               <span style={{ position: 'absolute', left: '8px', top: '7px', color: '#999' }}>🌐</span>
               <LangSelect style={{ paddingLeft: '30px' }}>
                 <option>English</option>
                 <option>Hindi</option>
               </LangSelect>
             </div>
          </div>
        </FooterContent>
      </LoginFooter>
    </PageContainer>
  );
}