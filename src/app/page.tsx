import { Suspense } from 'react';
import TextEditor from './components/TextEditor';

export default function Home() {
  return (
    <main className="min-h-screen px-24">
      <h4 className="font-semibold text-center py-4">
        Developing Christian Editor
      </h4>
      <Suspense fallback={null}>
        <TextEditor />
      </Suspense>
    </main>
  );
}
