'use client';

import Form from '@/components/Form';
import React from 'react';
import IUser from '@/types/IUser';

export default function Home() {
  const handleSubmit = (formData: IUser) => {
    alert(JSON.stringify(formData, null, 2));
  };
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-700">
      <Form handleSubmit={handleSubmit} />
    </main>
  );
}
