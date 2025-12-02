import FloatingQRButton from '@/components/ui/FloatingQRButton';
import React from 'react';
interface BasicPageLayoutProps {
  children: React.ReactNode;
}

const BasicPageLayout: React.FC<BasicPageLayoutProps> = ({ children }) => {
  return (
    <div className="page-layout">
      <main className="main-content">
        {children}
      </main>
       <FloatingQRButton />
    </div>
  );
};

export default BasicPageLayout;
