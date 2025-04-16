import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from './hooks/useDebounce';

interface RestaurantCategory {
  name: string;
  tip: number;
}

const categories: RestaurantCategory[] = [
  { name: "Fast Food", tip: 10 },
  { name: "Casual Dining", tip: 15 },
  { name: "Fine Dining", tip: 20 },
  { name: "Buffet", tip: 12 },
  { name: "Food Truck", tip: 10 }
];

const tipOptions = [10, 15, 20, 25];

function App() {
  const [billAmount, setBillAmount] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<RestaurantCategory>(categories[1]);
  const [error, setError] = useState<string>('');
  const [tipAmounts, setTipAmounts] = useState<Record<number, number>>({});
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const debouncedBillAmount = useDebounce(billAmount, 300);

  const validateBillAmount = useCallback((amount: string): boolean => {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('Please enter a valid bill amount greater than 0');
      return false;
    }
    if (!/^\d*\.?\d{0,2}$/.test(amount)) {
      setError('Please enter a valid amount with up to 2 decimal places');
      return false;
    }
    setError('');
    return true;
  }, []);

  const calculateTips = useCallback(() => {
    if (!debouncedBillAmount || !validateBillAmount(debouncedBillAmount)) {
      setTipAmounts({});
      setTotalAmount(0);
      return;
    }

    const amount = parseFloat(debouncedBillAmount);
    const newTipAmounts: Record<number, number> = {};

    tipOptions.forEach(percentage => {
      newTipAmounts[percentage] = Math.round((amount * percentage / 100) * 100) / 100;
    });

    setTipAmounts(newTipAmounts);
    setTotalAmount(Math.round((amount + newTipAmounts[selectedCategory.tip]) * 100) / 100);
  }, [debouncedBillAmount, selectedCategory.tip, validateBillAmount]);

  useEffect(() => {
    calculateTips();
  }, [calculateTips]);

  const handleBillAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setBillAmount(value);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = categories.find(c => c.name === e.target.value);
    if (category) {
      setSelectedCategory(category);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Tip Calculator</h1>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Restaurant Type
            </label>
            <select
              id="category"
              value={selectedCategory.name}
              onChange={handleCategoryChange}
              className="select-field"
            >
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="billAmount" className="block text-sm font-medium mb-1">
              Bill Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                type="text"
                id="billAmount"
                value={billAmount}
                onChange={handleBillAmountChange}
                placeholder="0.00"
                className="input-field pl-7"
                aria-invalid={!!error}
                aria-describedby={error ? "billAmountError" : undefined}
              />
            </div>
            {error && (
              <p id="billAmountError" className="error-message">
                {error}
              </p>
            )}
          </div>

          <table className="tip-table">
            <tbody>
              {tipOptions.map(percentage => (
                <tr key={percentage} className="tip-row">
                  <td className="tip-cell">Tip at {percentage}%:</td>
                  <td className="tip-cell text-right">
                    ${tipAmounts[percentage]?.toFixed(2) || '0.00'}
                  </td>
                </tr>
              ))}
              <tr className="tip-row suggested-tip">
                <td className="tip-cell">Suggested Tip ({selectedCategory.tip}%):</td>
                <td className="tip-cell text-right">
                  ${tipAmounts[selectedCategory.tip]?.toFixed(2) || '0.00'}
                </td>
              </tr>
              <tr className="tip-row font-bold">
                <td className="tip-cell">Total with Suggested Tip:</td>
                <td className="tip-cell text-right">
                  ${totalAmount.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App; 