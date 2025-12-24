'use client';

import styled from '@emotion/styled';
import { useRouter } from 'next/navigation';
import { FaCheck } from 'react-icons/fa';

const PageContainer = styled.div`
  background: linear-gradient(to bottom, #141414 0%, #2b102b 100%);
  min-height: 100vh;
  color: white;
  display: flex;
  flex-direction: column;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 4%;
  gap: 50px;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: 900px) {
    flex-direction: column;
    text-align: center;
  }
`;

const LeftColumn = styled.div`
  flex: 1;
  max-width: 600px;
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 30px;
  line-height: 1.2;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  font-size: 1.1rem;
  color: #e5e5e5;
  line-height: 1.5;

  svg {
    color: #e50914;
    min-width: 20px;
    margin-top: 5px;
  }
  
  a {
    color: white;
    text-decoration: underline;
    margin-left: 5px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 900px) {
    justify-content: center;
  }
`;

const AllowButton = styled.button`
  background-color: white;
  color: black;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  min-width: 120px;
  &:hover { background-color: #f0f0f0; }
`;

const BackButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid #333;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover { border-color: white; }
`;

const RealTransferImage = styled.img`
    width: 100%;
    max-width: 550px;
    height: auto;
    object-fit: contain;
    filter: drop-shadow(0 0 30px rgba(0,0,0,0.5));
`;

export default function TransferProfilePage() {
  const router = useRouter();

  return (
    <PageContainer>
      
      <ContentWrapper>
        <LeftColumn>
           <Title>Do you want to allow profile transfers?</Title>
           
           <FeatureList>
               <FeatureItem>
                   <FaCheck size={20} />
                   <span>
                       Other people using your account will be able to transfer a profile – including recommendations, viewing history, My List, saved games, settings and more – to their own membership that they pay for. 
                       <a href="#">Learn more.</a>
                   </span>
               </FeatureItem>
               <FeatureItem>
                   <FaCheck size={20} />
                   <span>
                       Allowing this feature will not log out any devices on your account. We will never transfer your payment information. Kids profiles cannot be transferred.
                   </span>
               </FeatureItem>
               <FeatureItem>
                   <FaCheck size={20} />
                   <span>
                       Simply click the button below to allow profiles to be transferred from your account. Updating this setting will not affect profile transfers into your account.
                   </span>
               </FeatureItem>
           </FeatureList>

           <ButtonGroup>
               <AllowButton onClick={() => router.push('/browse')}>Allow</AllowButton>
               <BackButton onClick={() => router.push('/browse')}>Go Back to Home</BackButton>
           </ButtonGroup>
        </LeftColumn>

        <RightColumn>
             <RealTransferImage src="https://assets.nflxext.com/ffe/siteui/acquisition/profileTransfer/BoxAsset_Account.png" alt="Profile Transfer" />
        </RightColumn>
      </ContentWrapper>
    </PageContainer>
  );
}
