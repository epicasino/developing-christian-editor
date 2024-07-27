'use client';
import '@mdxeditor/editor/style.css';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
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
  markdownShortcutPlugin,
  quotePlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import { Dispatch, FC, SetStateAction } from 'react';
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
  const imageUploadHandler: ImageUploadHandler = async (
    image: File | string
  ) => {
    if (typeof image == 'string') {
      return Promise.resolve(image);
    }
    const res = await getSignedURL({
      fileType: image.type,
      fileSize: image.size,
      checksum: await computeSHA256(image),
    });
    const url = res.success?.url;
    // console.log(url);
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
        markdownShortcutPlugin(),
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
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <InsertImage />
            </>
          ),
        }),
      ]}
    />
  );
};

export default Editor;
