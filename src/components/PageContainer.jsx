import React from 'react';

export default function PageContainer({ children }) {
  return (
    <main className="pt-12">
      {children}
    </main>
  );
}