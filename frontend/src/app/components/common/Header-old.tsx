'use client'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { open } = useWeb3Modal()
  return (
    <header>
      {/* Header content goes here */}
      <h1>{title}</h1>
      <button onClick={() => open()}>Open Connect Modal</button>

      <button onClick={() => open({ view: 'Networks' })}>Open Network Modal</button>

    </header>
  );
};

export default Header;
