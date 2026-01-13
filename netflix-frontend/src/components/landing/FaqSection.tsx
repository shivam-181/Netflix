'use client';
import { useState } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { AiOutlinePlus, AiOutlineClose } from 'react-icons/ai'; // npm install react-icons

const Container = styled.div`
  padding: 70px 45px;
  background: black;
  color: white;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 2rem;
  @media (min-width: 960px) { font-size: 3rem; }
`;

const Item = styled.div`
  margin-bottom: 8px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const Header = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: #2d2d2d;
  padding: 24px;
  width: 100%;
  border: none;
  color: white;
  font-size: 1.2rem;
  transition: background-color 0.2s;
  
  &:hover { background-color: #414141; }
  @media (min-width: 960px) { font-size: 1.5rem; }
`;

const Body = styled(motion.div)`
  background-color: #2d2d2d;
  text-align: left;
  padding: 24px;
  font-size: 1.2rem;
  border-top: 1px solid black;
  border-top: 1px solid black;
  overflow: hidden;
`;

/* Styled Components for the Email Form (Copied from LandingHero for consistency) */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100%;
  max-width: 36.625rem;
  margin: 1rem auto 0;
  padding-top: 0;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: flex-start;
    gap: 8px; 
  }
`;

const Input = styled.input`
  flex: 1;
  height: 3.5rem;
  padding: 0 1rem;
  border-radius: 4px;
  border: 1px solid rgba(128, 128, 128, 0.7);
  background: rgba(22, 22, 22, 0.7);
  color: white;
  font-size: 1rem;
  font-family: inherit;
  width: 100%;
  
  &::placeholder {
    color: #b3b3b3;
  }
`;

const GetStartedButton = styled.button`
  box-sizing: border-box; 
  min-height: 3.5rem;
  width: auto;
  padding: 0.75rem 1rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 0.25rem;
  background: #e50914;
  color: white; 
  font-family: inherit;
  border: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem; 
  white-space: nowrap;
  transition-duration: 250ms;
  transition-property: background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.68, 0.06);
  line-height: 1;
  position: relative; 

  &:hover {
    background: #f40612;
  }

  @media (min-width: 1280px) {
    font-size: 1.5rem;
  }
`;

const EmailFormText = styled.h3`
  font-size: 1.2rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 4.5rem 0 1rem; /* Increased top margin to push down */
  text-align: center;
  color: white;
`;

const FAQ_DATA = [
  { 
    question: "What is Netflix?", 
    answer: "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries and more." 
  },
  { 
    question: "How much does Netflix cost?", 
    answer: "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee." 
  },
  { 
    question: "Where can I watch?", 
    answer: "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com or on any internet-connected device." 
  },
  {
    question: "How do I cancel?",
    answer: "Netflix is flexible. There are no annoying contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime."
  },
  {
    question: "What can I watch on Netflix?",
    answer: "Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want."
  },
  {
    question: "Is Netflix good for kids?",
    answer: "The Netflix Kids experience is included in your membership to give parents control while kids enjoy family-friendly TV shows and movies in their own space. Kids profiles come with PIN-protected parental controls that let you restrict the maturity rating of content kids can watch and block specific titles you don’t want kids to see."
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Container>
      <Heading>Frequently Asked Questions</Heading>
      {FAQ_DATA.map((item, index) => (
        <Item key={index}>
          <Header onClick={() => toggle(index)}>
            {item.question}
            {openIndex === index ? <AiOutlineClose /> : <AiOutlinePlus />}
          </Header>
          <AnimatePresence>
            {openIndex === index && (
              <Body
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                {item.answer}
              </Body>
            )}
          </AnimatePresence>
        </Item>
      ))}

      <EmailFormText>
        Ready to watch? Enter your email to create or restart your membership.
      </EmailFormText>

      <Form action="/auth/signup">
        <Input type="email" placeholder="Email address" required />
        <GetStartedButton type="submit">
          Get Started 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </GetStartedButton>
      </Form>
    </Container>
  );
}