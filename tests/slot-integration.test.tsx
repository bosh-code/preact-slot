import { render, screen, fireEvent } from '@testing-library/preact';
import { Slot, Slottable } from '../src';

// Simulate shadcn/ui component patterns
describe('shadcn/ui integration patterns', () => {
  test('button asChild pattern', () => {
    const Button = ({ asChild = false, ...props }: any) => {
      if (asChild) {
        return <Slot {...props} />;
      }
      return <button {...props} />;
    };

    render(
      <Button asChild className="btn-primary" onClick={() => console.log('clicked')}>
        <Slottable>
          <a href="/test" className="link-style">
            Link as button
          </a>
        </Slottable>
      </Button>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveClass('btn-primary link-style');
    expect(link).toHaveAttribute('href', '/test');
  });

  test('card component pattern', () => {
    const Card = ({ asChild = false, ...props }: any) => {
      if (asChild) {
        return <Slot {...props} />;
      }
      return <div {...props} />;
    };

    render(
      <Card asChild className="card" data-testid="card">
        <Slottable>
          <section className="content">
            <h2>Title</h2>
            <p>Content</p>
          </section>
        </Slottable>
      </Card>
    );

    const section = screen.getByTestId('card');
    expect(section).toHaveClass('card content');
    expect(section.tagName).toBe('SECTION');
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
  });

  test('complex composition with multiple slots', () => {
    const Button = ({ asChild, ...props }: any) =>
      asChild ? <Slot {...props} /> : <button {...props} />;

    const Container = ({ asChild, ...props }: any) =>
      asChild ? <Slot {...props} /> : <div {...props} />;

    render(
      <Container asChild className="container">
        <Slottable>
          <div data-testid="wrapper">
            <Button asChild className="button-style">
              <Slottable>
                <a href="#test">Click me</a>
              </Slottable>
            </Button>
            <span>Some text</span>
          </div>
        </Slottable>
      </Container>
    );

    const wrapper = screen.getByTestId('wrapper');
    const link = screen.getByRole('link');

    expect(wrapper).toHaveClass('container');
    expect(link).toHaveClass('button-style');
    expect(link).toHaveAttribute('href', '#test');
  });

  test('event handler composition in integration', () => {
    const buttonClick = vi.fn();
    const slotClick = vi.fn();

    const Button = ({ asChild = false, ...props }: any) => {
      if (asChild) {
        return <Slot {...props} />;
      }
      return <button {...props} />;
    };

    render(
      <Button asChild onClick={slotClick}>
        <Slottable>
          <a href="#test" onClick={buttonClick}>
            Click me
          </a>
        </Slottable>
      </Button>
    );

    const link = screen.getByRole('link');
    fireEvent.click(link);

    expect(buttonClick).toHaveBeenCalledOnce();
    expect(slotClick).toHaveBeenCalledOnce();
  });
});
