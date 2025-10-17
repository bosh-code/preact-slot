// __tests__/slot.test.tsx
import { render, screen, fireEvent } from '@testing-library/preact';
import { useRef } from 'preact/hooks';
import { Slot, Slottable, composeRefs, useComposedRefs } from '../src';
import { expect } from 'vitest';

describe('Slot', () => {
  describe('Basic functionality', () => {
    test('renders children directly when no Slottable is present', () => {
      render(
        <Slot>
          <button>Click me</button>
        </Slot>
      );

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });
  });

  describe('Slottable functionality', () => {
    test('merges props with slottable children', () => {
      render(
        <Slot className="slot-class" data-testid="slot">
          <Slottable>
            <button className="btn-class">Test</button>
          </Slottable>
        </Slot>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('slot-class btn-class');
      expect(button).toHaveAttribute('data-testid', 'slot');
    });

    test('renders non-slottable children as siblings', () => {
      render(
        <Slot>
          <Slottable>
            <button>Slotted button</button>
          </Slottable>
          <span>Additional child</span>
          <div>Another child</div>
        </Slot>
      );

      expect(screen.getByRole('button', { name: 'Slotted button' })).toBeInTheDocument();
      expect(screen.getByText('Additional child')).toBeInTheDocument();
      expect(screen.getByText('Another child')).toBeInTheDocument();

      // Verify they are siblings, not nested
      const button = screen.getByRole('button');
      const span = screen.getByText('Additional child');
      expect(button.parentElement).toBe(span.parentElement);
    });

    test('handles multiple Slottable children by using the first one', () => {
      render(
        <Slot className="slot-class">
          <Slottable>
            <button>First</button>
          </Slottable>
          <Slottable>
            <button>Second</button>
          </Slottable>
        </Slot>
      );

      expect(screen.getByRole('button', { name: 'First' })).toHaveClass('slot-class');
      expect(screen.getByRole('button', { name: 'Second' })).not.toHaveClass('slot-class');
    });
  });

  describe('Prop merging', () => {
    test('merges classNames correctly', () => {
      render(
        <Slot className="slot-class-1 slot-class-2">
          <Slottable>
            <button className="btn-class-1 btn-class-2">Test</button>
          </Slottable>
        </Slot>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('slot-class-1 slot-class-2 btn-class-1 btn-class-2');
    });

    test('merges style objects', () => {
      render(
        <Slot style={{ color: 'red', fontSize: '16px' }}>
          <Slottable>
            <button style={{ backgroundColor: 'blue', fontSize: '14px' }}>Test</button>
          </Slottable>
        </Slot>
      );

      const button = screen.getByRole('button');

      expect(button.style.color).toBe('red');
      expect(button.style.backgroundColor).toBe('blue');
      expect(button.style.fontSize).toBe('14px');
    });

    test('composes event handlers', () => {
      const slotClick = vi.fn();
      const buttonClick = vi.fn();

      render(
        <Slot onClick={slotClick}>
          <Slottable>
            <button onClick={buttonClick}>Test</button>
          </Slottable>
        </Slot>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(buttonClick).toHaveBeenCalledOnce();
      expect(slotClick).toHaveBeenCalledOnce();
    });

    test('uses slot handler when child has no handler', () => {
      const slotClick = vi.fn();

      render(
        <Slot onClick={slotClick}>
          <Slottable>
            <button>Test</button>
          </Slottable>
        </Slot>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(slotClick).toHaveBeenCalledOnce();
    });

    test('uses child handler when slot has no handler', () => {
      const buttonClick = vi.fn();

      render(
        <Slot>
          <Slottable>
            <button onClick={buttonClick}>Test</button>
          </Slottable>
        </Slot>
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(buttonClick).toHaveBeenCalledOnce();
    });
  });

  describe('Ref handling', () => {
    test('forwards refs to slottable elements', () => {
      let receivedRef: HTMLButtonElement | null = null;

      const TestComponent = () => {
        const ref = useRef<HTMLButtonElement>(null);

        return (
          <Slot>
            <Slottable>
              <button
                ref={(node) => {
                  if (ref.current !== node) {
                    receivedRef = node;
                    if (ref) (ref as any).current = node;
                  }
                }}
              >
                Test
              </button>
            </Slottable>
          </Slot>
        );
      };

      render(<TestComponent/>);
      expect(receivedRef).toBeInstanceOf(HTMLButtonElement);
    });

    // test('composes multiple refs', () => {
    //   const ref1Results: (HTMLButtonElement | null)[] = [];
    //   const ref2Results: (HTMLButtonElement | null)[] = [];
    //
    //   const TestComponent = () => {
    //     const ref1 = (node: HTMLButtonElement | null) => ref1Results.push(node);
    //     const ref2 = (node: HTMLButtonElement | null) => ref2Results.push(node);
    //
    //     return (
    //       <Slot>
    //         <button ref={composeRefs(ref1, ref2)}>Test</button>
    //       </Slot>
    //     );
    //   };
    //
    //   render(<TestComponent />);
    //
    //   expect(ref1Results).toHaveLength(1);
    //   expect(ref2Results).toHaveLength(1);
    //   expect(ref1Results[0]).toBeInstanceOf(HTMLButtonElement);
    //   expect(ref2Results[0]).toBeInstanceOf(HTMLButtonElement);
    //   expect(ref1Results[0]).toBe(ref2Results[0]);
    // });
  });

  describe('Edge cases', () => {
    test('handles empty children', () => {
      const { container } = render(<Slot>{null}</Slot>);
      expect(container.firstChild).toBeNull();
    });

    test('handles fragment children', () => {
      render(
        <Slot>
          <Slottable>
            <>
              <button>First</button>
              <button>Second</button>
            </>
          </Slottable>
        </Slot>
      );

      // Should render the first element of the fragment
      expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    });

    test('works with other HTML elements', () => {
      render(
        <Slot className="wrapper" style={{ padding: '10px' }}>
          <Slottable>
            <div data-testid="content">Content</div>
          </Slottable>
        </Slot>
      );

      const div = screen.getByTestId('content');
      expect(div).toHaveClass('wrapper');
      expect(div).toHaveStyle({ padding: '10px' });
      expect(div).toHaveTextContent('Content');
    });
  });
});

describe('composeRefs', () => {
  test('handles function refs', () => {
    const ref1 = vi.fn();
    const ref2 = vi.fn();
    const composed = composeRefs(ref1, ref2);

    const element = document.createElement('button');
    composed(element);

    expect(ref1).toHaveBeenCalledWith(element);
    expect(ref2).toHaveBeenCalledWith(element);
  });

  test('handles mixed ref types', () => {
    const funcRef = vi.fn();
    const objRef = { current: null };
    const composed = composeRefs(funcRef, objRef);

    const element = document.createElement('button');
    composed(element);

    expect(funcRef).toHaveBeenCalledWith(element);
    expect(objRef.current).toBe(element);
  });

  test('handles undefined refs', () => {
    const validRef = vi.fn();
    const composed = composeRefs(validRef, undefined);

    const element = document.createElement('button');
    expect(() => composed(element)).not.toThrow();
    expect(validRef).toHaveBeenCalledWith(element);
  });
});

describe('useComposedRefs', () => {
  test('returns a stable function', () => {
    const ref1 = vi.fn();
    const ref2 = vi.fn();

    const TestComponent = () => {
      const composedRef = useComposedRefs(ref1, ref2);
      // We can't easily test memoization in testing-library context,
      // but we can verify it returns a function
      expect(typeof composedRef).toBe('function');
      return <button ref={composedRef}>Test</button>;
    };

    render(<TestComponent/>);
  });
});
