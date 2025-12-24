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
  overflow: hidden;
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
    </Container>
  );
}