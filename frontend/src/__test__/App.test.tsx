import { render, screen } from '@testing-library/react';
import App from '../App';

test('렌더링 테스트', () => {
  render(<App />);
  expect(screen.getAllByText(/로그인/i).length).toBeGreaterThan(0);
});