'use client';
import '@mdxeditor/editor/style.css';
import {
  BoldItalicUnderlineToggles,
  DiffSourceToggleWrapper,
  ImageUploadHandler,
  InsertImage,
  MDXEditor,
  MDXEditorMethods,
  UndoRedo,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  linkPlugin,
  listsPlugin,
  quotePlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { getSignedURL } from '@/actions/postActions';

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  setMarkdown: Dispatch<SetStateAction<string>>;
}

const computeSHA256 = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
};

const imageUploadHandler: ImageUploadHandler = async (image: File) => {
  const res = await getSignedURL({
    fileType: image.type,
    fileSize: image.size,
    checksum: await computeSHA256(image),
  });
  const url = res.success?.url;
  console.log(url);
  if (url) {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': image.type,
      },
      body: image,
    });
    return url.split('?')[0];
  }
  return 'Error Uploading';
};

const Editor: FC<EditorProps> = ({ markdown, editorRef, setMarkdown }) => {
  return (
    <MDXEditor
      onChange={(e) => setMarkdown(e)}
      ref={editorRef}
      markdown={markdown}
      plugins={[
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        linkPlugin(),
        imagePlugin({ imageUploadHandler }),
        diffSourcePlugin({
          diffMarkdown: 'An older version',
          viewMode: 'source',
        }),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <DiffSourceToggleWrapper>
                <UndoRedo />
              </DiffSourceToggleWrapper>
              <BoldItalicUnderlineToggles />
              <InsertImage />
            </>
          ),
        }),
      ]}
    />
  );
};

export default Editor;
