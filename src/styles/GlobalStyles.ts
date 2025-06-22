import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Courier Prime', monospace;
    background-color: #F5F5F5;
    color: #1A1A1A;
    line-height: 1.6;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'EB Garamond', serif;
    font-weight: 500;
    line-height: 1.2;
  }

  button {
    font-family: 'Courier Prime', monospace;
    border: none;
    background: none;
    cursor: pointer;
  }

  input, textarea {
    font-family: 'Courier Prime', monospace;
  }

  ::selection {
    background-color: #E8D0D0;
    color: #1A1A1A;
  }
`;

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #F5F5F5 0%, #FAFAFA 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(circle at 1px 1px, rgba(26, 26, 26, 0.02) 1px, transparent 0);
    background-size: 20px 20px;
    pointer-events: none;
  }
`;

export const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;