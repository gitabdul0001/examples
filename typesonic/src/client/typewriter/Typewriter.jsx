import React from 'react';

import { getTextLines, getLineMaxLength, LINE_MAX_OVERFLOW } from '../text';

const NBSP = String.fromCharCode(160);

export function Typewriter({ text, onSpeed, onFinished }) {
  const [currentLineIndex, setCurrentLineIndex] = React.useState(0);
  const [startDate, setStartDate] = React.useState(null);
  const [hasTypingError, setHasTypingError] = React.useState(false);
  const inputElem = React.useRef(null);
  const isStarted = React.useRef(false);
  const inputValue = React.useRef('');

  const lines = getTextLines(text);
  const currentLine = lines[currentLineIndex];
  const previousLine = lines[currentLineIndex - 1];
  const nextLine = lines[currentLineIndex + 1];

  const recalculateSpeed = () => {
    const { mainText } = calculateTextPartitions(currentLine, inputValue.current);
    let correctChars = mainText.length;
    for (let i = 0; i < currentLineIndex; i++) {
      correctChars += lines[i].length + 1; // Add one for the newline/space between lines
    }
    
    const words = correctChars / 5;
    const minutes = (Date.now() - startDate) / 60000;
    const speed = words / minutes;
    onSpeed(speed);
  };

  React.useEffect(() => {
    recalculateSpeed();
  }, [startDate, currentLineIndex]);

  const setInputText = (text) => {
    inputValue.current = text;

    // Calculate the original offset before modifying the DOM
    const selection = window.getSelection();
    const cursorOffset = getCursorOffset(selection);

    const originalText = currentLine;
    const { mainText, errorText } = calculateTextPartitions(originalText, text);
    
    while (inputElem.current.lastChild) {
      inputElem.current.removeChild(inputElem.current.lastChild);
    }

    const mainTextElem = document.createElement('span');
    mainTextElem.className = 'input-text--main';
    mainTextElem.textContent = formatInputText(mainText);

    const errorTextElem = document.createElement('span');
    errorTextElem.className = 'input-text--error text-red-600 bg-red-100';
    errorTextElem.textContent = formatInputText(errorText);

    inputElem.current.appendChild(mainTextElem);
    inputElem.current.appendChild(errorTextElem);

    const range = document.createRange();
    if (cursorOffset <= mainText.length) {
      range.setStart(mainTextElem.childNodes[0] || mainTextElem, cursorOffset);
    } else {
      range.setStart(errorTextElem.childNodes[0] || errorTextElem, Math.min(cursorOffset - mainText.length, errorText.length));
    }
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);

    setHasTypingError(errorText.length > 0);
  };

  const handleInput = (value) => {
    if (!isStarted.current) {
      isStarted.current = true;
      setStartDate(Date.now());
    }
    setInputText(value);
    recalculateSpeed();

    // Ignoring this check for now since we already have a check in onLineComplete
    // if (currentLineIndex === lines.length - 1 && value === currentLine) {
    //   // Last character of the text has been typed correctly
    //   onFinished();
    // }
  };

  const onLineComplete = () => {
    const isFinished = currentLineIndex >= lines.length - 1;
    setCurrentLineIndex(currentLineIndex + 1);
    setInputText('');
    if (isFinished) {
      onFinished();
    }
  };

  return (
    <div className="w-full mx-auto p-4 bg-white rounded-lg shadow-sm border border-solid border-gray-200 font-mono text-lg">
      <TextLine color="text-green-800">{previousLine}</TextLine>
      <TextLine className={hasTypingError ? 'bg-red-100' : ''}>
        {currentLine}
        <TextLineInput
          onLineComplete={onLineComplete}
          inputElem={inputElem}
          inputValue={inputValue}
          setInputText={handleInput}
          originalText={currentLine}
        />
      </TextLine>
      <TextLine>{nextLine}</TextLine>
    </div>
  );
}

function TextLineInput({ onLineComplete, inputElem, inputValue, setInputText, originalText }) {
  const handleChange = (e) => {
    let text = parseInputText(e.target.textContent);
    
    if (text.length > getLineMaxLength() + LINE_MAX_OVERFLOW) {
      // Bring back to the old value
      text = inputValue.current;
    }

    setInputText(text);
  };

  return (
    <div
      ref={inputElem}
      className={`absolute inset-0 w-full h-full whitespace-nowrap overflow-hidden text-green-600`}
      contentEditable={true}
      spellCheck={false}
      onKeyPress={e => handleInputKeyPress(e, inputValue.current, originalText, { onLineComplete })}
      onInput={handleChange}
    ></div>
  );
}

function TextLine({ children, color, className }) {
  return (
    <div className={`whitespace-nowrap relative ${color ?? 'text-gray-400'} ${className}`}>
      {children || NBSP}
    </div>
  );
};

function handleInputKeyPress(e, text, originalText, { onLineComplete }) {
  if (['Enter', ' '].includes(e.key) && text === originalText) {
    onLineComplete();
    e.preventDefault();
  } else if (e.key === 'Enter') {
    e.preventDefault();
  }
}

function calculateTextPartitions(originalText, text) {
  let i = 0;
  while (i < text.length && text[i] === originalText[i]) {
    i++;
  }
  return {
    mainText: text.slice(0, i),
    errorText: text.slice(i, text.length)
  };
}

function getCursorOffset(selection) {
  const selectedElement = selection.focusNode?.parentNode;

  if (selectedElement?.classList.contains('input-text--error')) {
    const mainText = document.querySelector('.input-text--main')?.textContent ?? '';
    return mainText.length + selection.focusOffset;
  }

  return selection.focusOffset;
}

function parseInputText(text) {
  return text.replace(/\s/g, ' ')
}

function formatInputText(text) {
  return text.replace(/\s/g, NBSP);
}
