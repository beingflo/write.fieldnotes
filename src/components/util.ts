import React from 'react';

export const getMetadata = (content: string | undefined): string => {
  const title = new DOMParser().parseFromString(content ?? '', 'text/html');
  const trimmedTitle = title.body.firstElementChild?.textContent ?? '';

  return JSON.stringify({ title: trimmedTitle, tags: '' });
};

export const useFocus = (): any => {
  const htmlElRef = React.useRef(null);
  const setFocus = () => {
    //@ts-ignore
    htmlElRef?.current && htmlElRef?.current?.focus();
  };

  return [htmlElRef, setFocus];
};
