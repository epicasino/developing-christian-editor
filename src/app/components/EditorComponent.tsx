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
  computeSHA256: (file: File) => Promise<string>;
}

const Editor: FC<EditorProps> = ({
  markdown,
  editorRef,
  setMarkdown,
  computeSHA256,
}) => {
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
