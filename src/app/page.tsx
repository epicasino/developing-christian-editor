import { Suspense } from 'react';
import TextEditor from './components/TextEditor';

export default function Home() {
  return (
    <main className="min-h-screen p-24">
      <Suspense fallback={null}>
        <TextEditor />
      </Suspense>
    </main>
  );
}
