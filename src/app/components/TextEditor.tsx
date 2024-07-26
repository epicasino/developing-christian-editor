'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const EditorComp = dynamic(() => import('./EditorComponent'), {
  ssr: false,
});

export default function TextEditor({
  handleSubmit,
}: {
  handleSubmit: (markdown: string) => void;
}) {
  const [markdown, setMarkdown] = useState(``);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(markdown);
        }}
      >
        <EditorComp markdown={markdown} setMarkdown={setMarkdown} />
        <button type="submit" className="">
          Submit
        </button>
      </form>
    </>
  );
}
