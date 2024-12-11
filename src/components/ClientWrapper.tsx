'use client';

import { ReactNode } from 'react';
import styles from './BackgroundEffect.module.css';

interface Props {
  children: ReactNode;
}

const BackgroundEffect = () => {
  return (
    <div className={`${styles.backgroundEffect} fixed inset-0 -z-50 overflow-hidden pointer-events-none`} />
  );
};

export default function ClientWrapper({ children }: Props) {
  return (
    <>
      <BackgroundEffect />
      {children}
    </>
  );
}
