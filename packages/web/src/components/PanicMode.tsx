'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calculator, X, Eye, EyeOff } from 'lucide-react';

interface PanicModeProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

export default function PanicMode({ isActive, onToggle }: PanicModeProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);
  const [history, setHistory] = useState<string[]>([]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive) return;

      const key = e.key;
      if (key >= '0' && key <= '9') handleNumber(key);
      else if (key === '+' || key === '-' || key === '*' || key === '/') handleOperator(key);
      else if (key === 'Enter' || key === '=') handleEquals();
      else if (key === 'Escape' || key === 'Backspace') handleClear();
      else if (key === '.') handleDecimal();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, display, previousValue, operation, newNumber]);

  const handleNumber = useCallback((num: string) => {
    setDisplay(prev => (newNumber ? num : prev === '0' ? num : prev + num));
    setNewNumber(false);
  }, [newNumber]);

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.');
      setNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(prev => prev + '.');
    }
  };

  const handleOperator = useCallback((op: string) => {
    if (previousValue !== null && !newNumber) {
      handleEquals();
    }
    setPreviousValue(display);
    setOperation(op);
    setNewNumber(true);
  }, [display, previousValue, newNumber]);

  const handleEquals = useCallback(() => {
    if (previousValue === null || operation === null) return;

    const prev = parseFloat(previousValue);
    const current = parseFloat(display);
    let result: number;

    switch (operation) {
      case '+': result = prev + current; break;
      case '-': result = prev - current; break;
      case '*': result = prev * current; break;
      case '/': result = current !== 0 ? prev / current : 0; break;
      default: return;
    }

    const resultStr = Number.isInteger(result) ? result.toString() : result.toFixed(2);
    setHistory(h => [...h.slice(-4), `${previousValue} ${operation} ${display} = ${resultStr}`]);
    setDisplay(resultStr);
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  }, [display, previousValue, operation]);

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handlePercentage = () => {
    const value = parseFloat(display) / 100;
    setDisplay(Number.isInteger(value) ? value.toString() : value.toFixed(2));
  };

  const handlePlusMinus = () => {
    setDisplay(prev => (-parseFloat(prev)).toString());
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-calm-100">
      {/* Fake Calculator App Header */}
      <div className="bg-calm-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calculator className="h-5 w-5 text-calm-400" />
          <span className="font-medium">Calculator</span>
        </div>
        <button
          onClick={() => onToggle(false)}
          className="p-2 hover:bg-calm-700 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Calculator Display */}
      <div className="bg-calm-800 px-4 py-6 text-right">
        {previousValue !== null && (
          <div className="text-calm-400 text-sm h-6">
            {previousValue} {operation}
          </div>
        )}
        <div className="text-white text-4xl font-light tracking-wide">
          {display}
        </div>
        {history.length > 0 && (
          <div className="text-calm-500 text-xs mt-2 space-y-1">
            {history.map((h, i) => (
              <div key={i} className="opacity-50">{h}</div>
            ))}
          </div>
        )}
      </div>

      {/* Calculator Keypad */}
      <div className="p-4">
        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
          {/* Row 1 */}
          <button onClick={handleClear} className="calculator-btn bg-calm-200 text-calm-800">AC</button>
          <button onClick={handlePlusMinus} className="calculator-btn bg-calm-200 text-calm-800">+/-</button>
          <button onClick={handlePercentage} className="calculator-btn bg-calm-200 text-calm-800">%</button>
          <button onClick={() => handleOperator('/')} className="calculator-btn bg-amber-400 text-white">÷</button>

          {/* Row 2 */}
          <button onClick={() => handleNumber('7')} className="calculator-btn bg-calm-700 text-white">7</button>
          <button onClick={() => handleNumber('8')} className="calculator-btn bg-calm-700 text-white">8</button>
          <button onClick={() => handleNumber('9')} className="calculator-btn bg-calm-700 text-white">9</button>
          <button onClick={() => handleOperator('*')} className="calculator-btn bg-amber-400 text-white">×</button>

          {/* Row 3 */}
          <button onClick={() => handleNumber('4')} className="calculator-btn bg-calm-700 text-white">4</button>
          <button onClick={() => handleNumber('5')} className="calculator-btn bg-calm-700 text-white">5</button>
          <button onClick={() => handleNumber('6')} className="calculator-btn bg-calm-700 text-white">6</button>
          <button onClick={() => handleOperator('-')} className="calculator-btn bg-amber-400 text-white">−</button>

          {/* Row 4 */}
          <button onClick={() => handleNumber('1')} className="calculator-btn bg-calm-700 text-white">1</button>
          <button onClick={() => handleNumber('2')} className="calculator-btn bg-calm-700 text-white">2</button>
          <button onClick={() => handleNumber('3')} className="calculator-btn bg-calm-700 text-white">3</button>
          <button onClick={() => handleOperator('+')} className="calculator-btn bg-amber-400 text-white">+</button>

          {/* Row 5 */}
          <button onClick={() => handleNumber('0')} className="calculator-btn bg-calm-700 text-white col-span-2">0</button>
          <button onClick={handleDecimal} className="calculator-btn bg-calm-700 text-white">.</button>
          <button onClick={handleEquals} className="calculator-btn bg-amber-400 text-white">=</button>
        </div>

        {/* Status Bar */}
        <div className="mt-8 text-center text-calm-500 text-sm">
          <p>Press ESC to exit panic mode</p>
        </div>
      </div>

      {/* Hidden exit instruction that appears on hover */}
      <style jsx>{`
        .calculator-btn {
          @apply h-14 rounded-xl text-xl font-medium transition-all duration-150 active:scale-95;
        }
      `}</style>
    </div>
  );
}
