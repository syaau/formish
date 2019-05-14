import React, { useRef, useCallback, useState } from 'react';

export function Upload({ onChange, ...other }) {
  const ref = useRef();

  const handleClick = useCallback(() => {
    ref.current.click();
  }, []);

  const handleChange = useCallback((e) => {
    if (e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(reader.result);
      }
      reader.readAsText(e.target.files[0]);
    }
  }, [onChange]);

  return (
    <>
      <input ref={ref} onChange={handleChange} type="file" style={{ display: 'none' }} />
      <button {...other} onClick={handleClick}></button>
    </>
  );
}

export function Download({ onPrepare, ...other }) {
  const [stage, setStage] = useState(0);
  const [file, setFile] = useState(null);

  const prepare = useCallback(async () => {
    setStage(1);
    const file = await onPrepare();
    const blob = new Blob([file.data], { type: file.type });
    // window.location.replace(URL.createObjectURL(blob));
    setFile({ blob, name: file.name });
  }, [onPrepare]);

  const reset = useCallback(() => {
    setStage(0);
    setFile(null);
  }, []);

  if (file) {
    return (
      <button>
      <a
        href={URL.createObjectURL(file.blob)}
        onClick={reset}
        download={file.name}
      >{`Download ${file.name}`}</a></button>
    );
  } else if (stage === 0) {
    return <button {...other} onClick={prepare} />
  } else if (stage === 1) {
    return <button {...other} disabled />
  }
}
