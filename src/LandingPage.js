import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { Mic, BarChart2, Calendar, TrendingUp } from 'lucide-react';


const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.cdnfonts.com/css/sf-pro-display');
  
  body {
    font-family: 'SF Pro Display', sans-serif;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
  padding: 20px;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  z-index: 1;
  animation: ${fadeIn} 1s ease-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  color: #1F2937;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #4B5563;
  max-width: 600px;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const EnterButton = styled.button`
  background-color: #3B82F6;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);

  &:hover {
    background-color: #2563EB;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0,0,0,0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const IconsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

const IconWrapper = styled.div`
  margin: 0 20px;
  animation: ${float} 3s ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const StyledIcon = styled.div`
  color: #3B82F6;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.2);
  }
`;

const CanvasBackground = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.2;
`;

const AnimatedBackground = () => {
  useEffect(() => {
    const canvas = document.getElementById('backgroundCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const symbols = '0123456789ABCDEF↑↓→←∑∏∫∂∇∆πΣΩ';

    function drawChart(x, y, size) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      for (let i = 0; i < size; i++) {
        ctx.lineTo(x + i * 5, y - Math.random() * 50);
      }
      ctx.stroke();
    }

    function draw() {
      ctx.fillStyle = 'rgba(240, 249, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#3B82F6';
      ctx.font = `${fontSize}px 'SF Pro Display', sans-serif`;

      for (let i = 0; i < drops.length; i++) {
        const text = symbols[Math.floor(Math.random() * symbols.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      ctx.strokeStyle = '#3B82F6';
      for (let i = 0; i < 5; i++) {
        drawChart(Math.random() * canvas.width, Math.random() * canvas.height, 20);
      }
    }

    const interval = setInterval(draw, 33);

    return () => clearInterval(interval);
  }, []);

  return <CanvasBackground id="backgroundCanvas" />;
};

  const AdditionalInfo = styled.p`
  font-size: 0.9rem;
  color: #4B5563;
  margin-top: 10px;
  line-height: 1.4;
`;

const LandingPage = ({ onEnter }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <GlobalStyle />
      <LandingContainer>
        <AnimatedBackground />
        {showContent && (
          <ContentWrapper>
            <Title>StudioStats - Pumaisdue</Title>
            <IconsContainer>
              <IconWrapper delay="0s"><StyledIcon as={Mic} size={40} /></IconWrapper>
              <IconWrapper delay="0.5s"><StyledIcon as={BarChart2} size={40} /></IconWrapper>
              <IconWrapper delay="1s"><StyledIcon as={Calendar} size={40} /></IconWrapper>
              <IconWrapper delay="1.5s"><StyledIcon as={TrendingUp} size={40} /></IconWrapper>
            </IconsContainer>
            <Subtitle>
              Esplora le statistiche e le performance dello studio.
              Analizza i trend e confronta i dati.
            </Subtitle>
            <EnterButton onClick={onEnter}>Entra nella Dashboard</EnterButton>
            <AdditionalInfo>
              Per una migliore esperienza, ruotare il telefono in orizzontale.<br />
              Versione 1.2.2
            </AdditionalInfo>
          </ContentWrapper>
        )}
      </LandingContainer>
    </>
  );
};

export default LandingPage;