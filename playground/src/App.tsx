import { Slot, Slottable } from '../../src';
import { useRef } from 'preact/compat';

export function App() {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Slot className="slot-class" data-test="slot">
        <Slottable>
          <button ref={ref} className="btn-class" data-test="button">Test</button>
        </Slottable>
      </Slot>

      <Slot onClick={() => console.log('slot')}>
        <Slottable>
          <button onClick={() => console.log('button')}>Merged Fn props</button>
        </Slottable>
      </Slot>

      <Slot>
        <Slottable>
          <div>Slotted</div>
        </Slottable>
        <span>Child 1</span>
        <span>Child 2</span>
      </Slot>
    </>
  );
}
