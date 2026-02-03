import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChartTypeToggle } from '@/features/dashboard/components/BalanceTrendsChart/ChartTypeToggle';

/**
 * Test Suite: ChartTypeToggle Component
 * 
 * Tests for chart type toggle button component.
 */

describe('ChartTypeToggle', () => {
  describe('T048: renders line and bar buttons', () => {
    it('should render both line and bar buttons', () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      const barButton = screen.getByRole('button', { name: /bar chart/i });

      expect(lineButton).toBeInTheDocument();
      expect(barButton).toBeInTheDocument();
    });

    it('should render line chart icon', () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      expect(lineButton).toHaveTextContent('📈');
    });

    it('should render bar chart icon', () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      expect(barButton).toHaveTextContent('📊');
    });

    it('should have group role for accessibility', () => {
      const { container } = render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toBeInTheDocument();
    });
  });

  describe('T049: active button has correct styling', () => {
    it('should apply active class to line button when line is selected', () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      expect(lineButton).toHaveClass('chart-type-button--active');
    });

    it('should apply active class to bar button when bar is selected', () => {
      render(
        <ChartTypeToggle 
          chartType="bar" 
          onTypeChange={vi.fn()} 
        />
      );

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      expect(barButton).toHaveClass('chart-type-button--active');
    });

    it('should not apply active class to line button when bar is selected', () => {
      render(
        <ChartTypeToggle 
          chartType="bar" 
          onTypeChange={vi.fn()} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      expect(lineButton).not.toHaveClass('chart-type-button--active');
    });

    it('should not apply active class to bar button when line is selected', () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      expect(barButton).not.toHaveClass('chart-type-button--active');
    });

    it('should have aria-pressed="true" on active button', () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      expect(lineButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have aria-pressed="false" on inactive button', () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      expect(barButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  describe('T050: clicking button calls onTypeChange callback', () => {
    it('should call onTypeChange with "bar" when bar button is clicked', async () => {
      const onTypeChange = vi.fn();
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={onTypeChange} 
        />
      );

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      await userEvent.click(barButton);

      expect(onTypeChange).toHaveBeenCalledWith('bar');
      expect(onTypeChange).toHaveBeenCalledTimes(1);
    });

    it('should call onTypeChange with "line" when line button is clicked', async () => {
      const onTypeChange = vi.fn();
      render(
        <ChartTypeToggle 
          chartType="bar" 
          onTypeChange={onTypeChange} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      await userEvent.click(lineButton);

      expect(onTypeChange).toHaveBeenCalledWith('line');
      expect(onTypeChange).toHaveBeenCalledTimes(1);
    });

    it('should not call onTypeChange when clicking already active button', async () => {
      const onTypeChange = vi.fn();
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={onTypeChange} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      await userEvent.click(lineButton);

      expect(onTypeChange).not.toHaveBeenCalled();
    });

    it('should handle multiple clicks correctly', async () => {
      const onTypeChange = vi.fn();
      const { rerender } = render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={onTypeChange} 
        />
      );

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      await userEvent.click(barButton);

      expect(onTypeChange).toHaveBeenCalledWith('bar');

      // Simulate state update
      rerender(
        <ChartTypeToggle 
          chartType="bar" 
          onTypeChange={onTypeChange} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      await userEvent.click(lineButton);

      expect(onTypeChange).toHaveBeenCalledWith('line');
      expect(onTypeChange).toHaveBeenCalledTimes(2);
    });
  });

  describe('T051: keyboard navigation works (Tab, Enter, Space)', () => {
    it('should focus line button on tab press', async () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      
      await userEvent.tab();
      expect(lineButton).toHaveFocus();
    });

    it('should focus bar button on second tab press', async () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      
      await userEvent.tab();
      await userEvent.tab();
      expect(barButton).toHaveFocus();
    });

    it('should call onTypeChange with Enter key', async () => {
      const onTypeChange = vi.fn();
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={onTypeChange} 
        />
      );

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      barButton.focus();
      await userEvent.keyboard('{Enter}');

      expect(onTypeChange).toHaveBeenCalledWith('bar');
    });

    it('should call onTypeChange with Space key', async () => {
      const onTypeChange = vi.fn();
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={onTypeChange} 
        />
      );

      const barButton = screen.getByRole('button', { name: /bar chart/i });
      barButton.focus();
      await userEvent.keyboard(' ');

      expect(onTypeChange).toHaveBeenCalledWith('bar');
    });

    it('should have proper tab order', async () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const lineButton = screen.getByRole('button', { name: /line chart/i });
      const barButton = screen.getByRole('button', { name: /bar chart/i });

      await userEvent.tab();
      expect(lineButton).toHaveFocus();

      await userEvent.tab();
      expect(barButton).toHaveFocus();
    });
  });

  describe('edge cases', () => {
    it('should handle missing onTypeChange gracefully', () => {
      expect(() => {
        render(
          <ChartTypeToggle 
            chartType="line" 
            onTypeChange={undefined as any} 
          />
        );
      }).not.toThrow();
    });

    it('should render with default props', () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      expect(screen.getByRole('button', { name: /line chart/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /bar chart/i })).toBeInTheDocument();
    });

    it('should apply custom className if provided', () => {
      const { container } = render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()}
          className="custom-class"
        />
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveClass('custom-class');
    });

    it('should maintain button state after re-renders', () => {
      const { rerender } = render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      let lineButton = screen.getByRole('button', { name: /line chart/i });
      expect(lineButton).toHaveClass('chart-type-button--active');

      rerender(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      lineButton = screen.getByRole('button', { name: /line chart/i });
      expect(lineButton).toHaveClass('chart-type-button--active');
    });
  });

  describe('accessibility', () => {
    it('should have accessible names for both buttons', () => {
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      expect(screen.getByRole('button', { name: /line chart/i })).toHaveAccessibleName();
      expect(screen.getByRole('button', { name: /bar chart/i })).toHaveAccessibleName();
    });

    it('should have aria-label on group', () => {
      const { container } = render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={vi.fn()} 
        />
      );

      const group = container.querySelector('[role="group"]');
      expect(group).toHaveAttribute('aria-label');
    });

    it('should be keyboard accessible', async () => {
      const onTypeChange = vi.fn();
      render(
        <ChartTypeToggle 
          chartType="line" 
          onTypeChange={onTypeChange} 
        />
      );

      await userEvent.tab();
      await userEvent.tab();
      await userEvent.keyboard('{Enter}');

      expect(onTypeChange).toHaveBeenCalledWith('bar');
    });
  });
});
