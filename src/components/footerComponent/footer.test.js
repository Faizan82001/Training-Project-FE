import { render, screen } from '@testing-library/react';
import FooterComponent from './FooterComponent';
test('rendering of footer component', () => {
    render(
        <FooterComponent />
    );
    const footerText = screen.getByText(/Medical Data Innovations/i);
    expect(footerText).toBeInTheDocument();
  });
