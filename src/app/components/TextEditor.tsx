'use client';
import { getSignedURL, uploadPost } from '@/actions/postActions';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
const EditorComp = dynamic(() => import('./EditorComponent'), {
  ssr: false,
});

interface iHeaderInput {
  title: string;
  subTitle?: string;
}

export default function TextEditor() {
  const [headerInput, setHeaderInput] = useState<iHeaderInput>({
    title: '',
    subTitle: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [fileURL, setFileURL] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState(``);
  const [postedArticle, setPostedArticle] = useState<string>();

  const computeSHA256 = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
    fileURL && URL.revokeObjectURL(fileURL);
    file ? setFileURL(URL.createObjectURL(file)) : setFileURL(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const signedURLRes = await getSignedURL({
        fileType: file.type,
        fileSize: file.size,
        checksum: await computeSHA256(file),
      });
      const url = signedURLRes.success?.url;
      if (url) {
        // console.log(url);

        await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': file.type,
          },
          body: file,
        });
      }
      const res = await uploadPost({
        title: headerInput.title,
        subtitle: headerInput.subTitle === '' ? null : headerInput.subTitle,
        image: url?.split('?')[0],
        content: markdown,
      });
      if (res) return res;
    } else {
      const res = await uploadPost({
        title: headerInput.title,
        subtitle: headerInput.subTitle === '' ? null : headerInput.subTitle,
        image: null,
        content: markdown,
      });
      if (res) return setPostedArticle(res[0].id);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          required
          name="header"
          placeholder="Title"
          className="text-4xl w-full border-2 border-zinc-200 rounded-md p-1"
          value={headerInput.title}
          onChange={(e) =>
            setHeaderInput({ ...headerInput, title: e.target.value })
          }
        />
        <input
          type="text"
          name="header"
          placeholder="Subtitle (Optional)"
          className="text-2xl w-full border-2 border-zinc-200 rounded-md p-1"
          value={headerInput.subTitle}
          onChange={(e) =>
            setHeaderInput({ ...headerInput, subTitle: e.target.value })
          }
        />
        <input
          type="file"
          name="media"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg"
          placeholder="Title"
          className="text-lg w-full rounded-md p-1"
          onChange={handleFileChange}
        />
        {fileURL && file && (
          <div>
            {file.type.startsWith('image/') ? (
              <Image
                src={fileURL}
                alt="Selected file"
                width={0}
                height={0}
                className="w-[40vw] h-auto"
              />
            ) : null}
          </div>
        )}
        <EditorComp
          markdown={markdown}
          setMarkdown={setMarkdown}
          computeSHA256={computeSHA256}
        />
        <button
          type="submit"
          className="bg-blue-500 text-center self-center text-white py-2 px-4 rounded-md transition hover:bg-blue-700"
        >
          Post Article
        </button>
      </form>
      {postedArticle && (
        <h6 className="self-center">Posted Article! ID: {postedArticle}</h6>
      )}
    </>
  );
}
