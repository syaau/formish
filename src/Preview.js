import React from 'react';
import ReactMarkdown from 'react-markdown/with-html';
import { useMarkDown } from './processor';

const onPrint = () => window.print();

export default function Preview({ source, structure, record, printable }) {
  const markdown = useMarkDown(source, structure, record);

  return (
    <div className="Preview">
      {printable && (
        <button
          style={{position: 'absolute', right: 20, top: 20 }}
          onClick={onPrint}
        >
          Print
        </button>
      )}
      <div className="Paper">
        <ReactMarkdown source={markdown} escapeHtml={false} />
      </div>
    </div>
  );
}
