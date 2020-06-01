import React from 'react';
import { render } from '@testing-library/react';
import UrlsRouter from "./main/UrlsRouter";


test('renders learn react link', () => {
  const { getByText } = render(<UrlsRouter />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
