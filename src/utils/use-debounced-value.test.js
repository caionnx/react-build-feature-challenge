import { render, fireEvent, waitFor, act } from '@testing-library/react';
import React from 'react';
import useDebouncedValue from './use-debounced-value';

jest.useFakeTimers();

describe('useDebouncedValue', () => {
  it('should update debounced value after delay', async () => {
    const TestComponent = () => {
      const [value, setValue, debouncedValue] = useDebouncedValue('');

      return (
        <div>
          <input
            type="text"
            value={value}
            data-testid="debounced-value-input"
            onChange={(e) => setValue(e.target.value)}
          />
          <div data-testid="debounced-value">{debouncedValue}</div>
        </div>
      );
    };

    const { getByTestId } = render(<TestComponent />);

    const input = getByTestId('debounced-value-input');

    fireEvent.change(input, { target: { value: 'Hello' } });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(getByTestId('debounced-value')).toHaveTextContent('Hello');
    });
  });
});
