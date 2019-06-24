import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Tray } from './Tray';

describe('Tray', () => {
  const TestChild = () => <div data-testid="test-child" />;

  it('renders children', () => {
    const { queryByTestId } = render(
      <Tray title="title">
        <TestChild />
      </Tray>
    );

    expect(queryByTestId('test-child')).toBeInTheDocument();
  });

  it('renders title', () => {
    const { queryByText } = render(
      <Tray title="title">
        <TestChild />
      </Tray>
    );

    expect(queryByText('title')).toBeInTheDocument();
  });

  describe('when closed', () => {
    it('render closed style', () => {
      const { getByTestId } = render(
        <Tray title="title">
          <TestChild />
        </Tray>
      );

      expect(getByTestId('tray')).toHaveStyle('transform: translateY(0)');
    });

    it('renders label', () => {
      const { queryByText } = render(
        <Tray title="title" renderLabel={() => <div>Closed label</div>}>
          <TestChild />
        </Tray>
      );

      expect(queryByText('Closed label')).toBeInTheDocument();
    });

    it('renders angle-up icon', () => {
      const { container } = render(
        <Tray title="title">
          <TestChild />
        </Tray>
      );

      expect(container.querySelector('svg')).toHaveClass('fa-angle-up');
    });

    it('opens on click', () => {
      const { container, getByTestId } = render(
        <Tray title="title">
          <TestChild />
        </Tray>
      );

      fireEvent.click(container.querySelector('button'));

      expect(getByTestId('tray')).toHaveStyle('transform: translateY(-100%)');
    });
  });

  describe('when open', () => {
    it('renders angle-down icon', () => {
      const { container } = render(
        <Tray title="title">
          <TestChild />
        </Tray>
      );

      fireEvent.click(container.querySelector('button'));

      expect(container.querySelector('svg')).toHaveClass('fa-angle-down');
    });

    it('does not render label', () => {
      const { container, queryByText } = render(
        <Tray title="title" renderLabel={() => <div>Closed label</div>}>
          <TestChild />
        </Tray>
      );

      fireEvent.click(container.querySelector('button'));

      expect(queryByText('Closed label')).not.toBeInTheDocument();
    });

    it('closes on click', () => {
      const { container, getByTestId } = render(
        <Tray title="title">
          <TestChild />
        </Tray>
      );

      fireEvent.click(container.querySelector('button'));

      expect(getByTestId('tray')).toHaveStyle('transform: translateY(-100%)');

      fireEvent.click(container.querySelector('button'));

      expect(getByTestId('tray')).toHaveStyle('transform: translateY(0)');
    });
  });

  describe('rightAlign', () => {
    it('pulls link to the right', () => {
      const { container } = render(
        <Tray title="title" rightAlign>
          <TestChild />
        </Tray>
      );

      expect(container.querySelector('button')).toHaveStyle(
        'justifyContent: flex-end'
      );
    });
  });
});
