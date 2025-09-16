import React, { useState, useCallback } from 'react';
import { Display } from './Display';
import { Button } from './Button';

type Operation = '+' | '-' | '×' | '÷' | null;

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [expression, setExpression] = useState('');

  const inputNumber = useCallback((num: string) => {
    if (hasError) {
      setHasError(false);
      setDisplay(num);
      setWaitingForOperand(false);
      setExpression(num);
      return;
    }

    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
      setExpression(prev => prev + num);
    } else {
      setDisplay(display === '0' ? num : display + num);
      if (display === '0') {
        setExpression(num);
      } else {
        setExpression(prev => prev + num);
      }
    }
  }, [display, waitingForOperand, hasError]);

  const inputDecimal = useCallback(() => {
    if (hasError) {
      setHasError(false);
      setDisplay('0.');
      setWaitingForOperand(false);
      setExpression('0.');
      return;
    }

    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
      setExpression(prev => prev + '0.');
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
      setExpression(prev => prev + '.');
    }
  }, [display, waitingForOperand, hasError]);

  const clear = useCallback(() => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setHasError(false);
    setExpression('');
  }, []);

  const performOperation = useCallback((nextOperation: Operation) => {
    const inputValue = parseFloat(display);

    if (hasError) {
      setHasError(false);
      setPreviousValue(inputValue);
      setOperation(nextOperation);
      setWaitingForOperand(true);
      if (nextOperation) {
        setExpression(String(inputValue) + nextOperation);
      }
      return;
    }

    if (previousValue === null) {
      setPreviousValue(inputValue);
      if (nextOperation) {
        setExpression(String(inputValue) + nextOperation);
      }
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result: number;

      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          if (inputValue === 0) {
            setDisplay('Error');
            setHasError(true);
            setPreviousValue(null);
            setOperation(null);
            setWaitingForOperand(true);
            setExpression('Error');
            return;
          }
          result = currentValue / inputValue;
          break;
        default:
          return;
      }

      // Handle result formatting
      if (isNaN(result) || !isFinite(result)) {
        setDisplay('Error');
        setHasError(true);
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        setExpression('Error');
        return;
      }

      // Format the result to avoid floating point issues
      const formattedResult = parseFloat(result.toPrecision(12));
      setDisplay(String(formattedResult));
      setPreviousValue(formattedResult);
      
      if (nextOperation) {
        setExpression(String(formattedResult) + nextOperation);
      } else {
        setExpression(String(currentValue) + operation + String(inputValue) + '=' + String(formattedResult));
      }
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  }, [display, previousValue, operation, hasError]);

  const calculate = useCallback(() => {
    performOperation(null);
    setOperation(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  }, [performOperation]);

  return (
    <div className="max-w-sm mx-auto bg-black rounded-3xl p-6 shadow-2xl">
      <Display value={display} hasError={hasError} expression={expression} />
      
      <div className="grid grid-cols-4 gap-3 mt-6">
        {/* First Row */}
        <Button
          onClick={clear}
          className="bg-gray-300 hover:bg-gray-200 text-black font-semibold"
        >
          AC
        </Button>
        <Button
          onClick={() => {
            if (display !== '0' && !hasError) {
              const newValue = display.startsWith('-') ? display.slice(1) : '-' + display;
              setDisplay(newValue);
              setExpression(prev => prev.replace(/[^+\-×÷]*$/, newValue));
            }
          }}
          className="bg-gray-300 hover:bg-gray-200 text-black font-semibold"
        >
          ±
        </Button>
        <Button
          onClick={() => {
            if (display !== '0' && !hasError) {
              const newValue = String(parseFloat(display) / 100);
              setDisplay(newValue);
              setExpression(prev => prev.replace(/[^+\-×÷]*$/, newValue));
            }
          }}
          className="bg-gray-300 hover:bg-gray-200 text-black font-semibold"
        >
          %
        </Button>
        <Button
          onClick={() => performOperation('÷')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold"
          active={operation === '÷'}
        >
          ÷
        </Button>

        {/* Second Row */}
        <Button onClick={() => inputNumber('7')}>7</Button>
        <Button onClick={() => inputNumber('8')}>8</Button>
        <Button onClick={() => inputNumber('9')}>9</Button>
        <Button
          onClick={() => performOperation('×')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold"
          active={operation === '×'}
        >
          ×
        </Button>

        {/* Third Row */}
        <Button onClick={() => inputNumber('4')}>4</Button>
        <Button onClick={() => inputNumber('5')}>5</Button>
        <Button onClick={() => inputNumber('6')}>6</Button>
        <Button
          onClick={() => performOperation('-')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold"
          active={operation === '-'}
        >
          −
        </Button>

        {/* Fourth Row */}
        <Button onClick={() => inputNumber('1')}>1</Button>
        <Button onClick={() => inputNumber('2')}>2</Button>
        <Button onClick={() => inputNumber('3')}>3</Button>
        <Button
          onClick={() => performOperation('+')}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold"
          active={operation === '+'}
        >
          +
        </Button>

        {/* Fifth Row */}
        <Button
          onClick={() => inputNumber('0')}
          className="col-span-2 bg-gray-600 hover:bg-gray-500 text-white font-semibold"
        >
          0
        </Button>
        <Button onClick={inputDecimal}>.</Button>
        <Button
          onClick={calculate}
          className="bg-orange-500 hover:bg-orange-400 text-white font-semibold"
        >
          =
        </Button>
      </div>
    </div>
  );
};