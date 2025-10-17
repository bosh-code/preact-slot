import { type ComponentChildren, cloneElement, toChildArray, type JSX, type HTMLAttributes } from 'preact';
import { forwardRef } from 'preact/compat';
import { composeRefs } from './compose-refs';

interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ComponentChildren;
}

interface SlottableProps {
  children: ComponentChildren;
}

const SLOTTABLE_IDENTIFIER = Symbol('preact.slottable');

const Slottable = ({ children }: SlottableProps) => {
  return <>{children}</>;
};
Slottable.__slotId = SLOTTABLE_IDENTIFIER;

const isSlottable = (child: ComponentChildren): child is JSX.Element => (
  child != null &&
  typeof child === 'object' &&
  'type' in child &&
  typeof child.type === 'function' &&
  (child.type as any).__slotId === SLOTTABLE_IDENTIFIER
);

const mergeProps = (slotProps: any, childProps: any) => {
  const overrideProps = { ...childProps };

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === 'style') {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === 'className') {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(' ');
    }
  }

  return { ...slotProps, ...overrideProps };
};

const SlotClone = forwardRef<any, { children: ComponentChildren }>((props, forwardedRef) => {
  const { children, ...slotProps } = props;

  if (children && typeof children === 'object' && 'props' in children) {
    const childProps = children.props || {};
    const mergedProps = mergeProps(slotProps, childProps);

    // Add ref handling
    if (forwardedRef) {
      const childRef = childProps.ref;
      mergedProps.ref = childRef ? composeRefs(forwardedRef, childRef) : forwardedRef;
    }

    return cloneElement(children, mergedProps);
  }

  return toChildArray(children).length > 1 ? toChildArray(children)[0] : null;
});

const Slot = forwardRef<HTMLElement, SlotProps>((props, forwardedRef) => {
  const { children, ...slotProps } = props;
  const childrenArray = toChildArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable && 'props' in slottable) {
    const newElement = slottable.props.children;

    // Get non-slottable children (these should be rendered as siblings)
    const nonSlottableChildren = childrenArray.filter(child => child !== slottable);

    if (newElement && typeof newElement === 'object' && 'props' in newElement) {
      // Clone the slottable element with merged props
      const slottedElement = cloneElement(
        newElement,
        mergeProps(slotProps, newElement.props)
      );

      // Return both the slotted element AND the non-slottable children as siblings
      return (
        <>
          {slottedElement}
          {nonSlottableChildren}
        </>
      );
    }
  }

  // If no slottable, just render all children normally
  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});

const Root = Slot;

export {
  Slot,
  Slottable,
  Root,
  composeRefs
};

export type { SlotProps };
