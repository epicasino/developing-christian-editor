import { Suspense } from 'react';
import TextEditor from './components/TextEditor';

const handleSubmit = async (markdown: string) => {
  'use server';
};

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <Suspense fallback={null}>
        <TextEditor handleSubmit={handleSubmit} />
      </Suspense>
    </main>
  );
}
