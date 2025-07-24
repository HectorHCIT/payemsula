import {render, screen} from '@testing-library/react';
import Home from '@/app/page';
import { AlertProvider } from '@/providers/alert-provider';

// Mock motion/react para evitar problemas con animaciones en tests
jest.mock('motion/react', () => ({
  motion: {
    div: 'div',
    section: 'section', 
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    span: 'span',
    img: 'img',
    button: 'button',
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

it("should renders home page", () => {
  render(
    <AlertProvider>
      <Home />
    </AlertProvider>
  );
  expect(screen.getByText('¿Por qué pagar con nuestro sistema?')).toBeInTheDocument();
});