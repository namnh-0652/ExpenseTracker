import { describe, it, expect } from "vitest";
import * as calculationService from "@/features/dashboard/services/calculationService";
import type { Transaction } from "@/shared/types";

describe("calculationService", () => {
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      amount: 3000,
      date: "2026-02-01",
      type: "income",
      categoryId: "salary",
      categoryName: "Salary",
      description: "Monthly salary",
      createdAt: "2026-02-01T09:00:00.000Z",
      updatedAt: "2026-02-01T09:00:00.000Z",
    },
    {
      id: "2",
      amount: 500,
      date: "2026-02-02",
      type: "income",
      categoryId: "freelance",
      categoryName: "Freelance",
      description: "Freelance project",
      createdAt: "2026-02-02T10:00:00.000Z",
      updatedAt: "2026-02-02T10:00:00.000Z",
    },
    {
      id: "3",
      amount: 50.5,
      date: "2026-02-01",
      type: "expense",
      categoryId: "food",
      categoryName: "Food & Dining",
      description: "Lunch",
      createdAt: "2026-02-01T12:00:00.000Z",
      updatedAt: "2026-02-01T12:00:00.000Z",
    },
    {
      id: "4",
      amount: 150,
      date: "2026-02-02",
      type: "expense",
      categoryId: "food",
      categoryName: "Food & Dining",
      description: "Groceries",
      createdAt: "2026-02-02T14:00:00.000Z",
      updatedAt: "2026-02-02T14:00:00.000Z",
    },
    {
      id: "5",
      amount: 30,
      date: "2026-02-02",
      type: "expense",
      categoryId: "transport",
      categoryName: "Transportation",
      description: "Gas",
      createdAt: "2026-02-02T16:00:00.000Z",
      updatedAt: "2026-02-02T16:00:00.000Z",
    },
  ];

  describe("calculateTotalIncome", () => {
    it("should calculate total income from transactions", () => {
      const result = calculationService.calculateTotalIncome(mockTransactions);
      expect(result).toBe(3500); // 3000 + 500
    });

    it("should return 0 for empty array", () => {
      const result = calculationService.calculateTotalIncome([]);
      expect(result).toBe(0);
    });

    it("should return 0 when no income transactions", () => {
      const expenses = mockTransactions.filter((t) => t.type === "expense");
      const result = calculationService.calculateTotalIncome(expenses);
      expect(result).toBe(0);
    });

    it("should handle decimal amounts correctly", () => {
      const transactions: Transaction[] = [
        {
          ...mockTransactions[0],
          amount: 100.75,
        },
        {
          ...mockTransactions[1],
          amount: 200.25,
        },
      ];
      const result = calculationService.calculateTotalIncome(transactions);
      expect(result).toBe(301);
    });
  });

  describe("calculateTotalExpenses", () => {
    it("should calculate total expenses from transactions", () => {
      const result =
        calculationService.calculateTotalExpenses(mockTransactions);
      expect(result).toBe(230.5); // 50.5 + 150 + 30
    });

    it("should return 0 for empty array", () => {
      const result = calculationService.calculateTotalExpenses([]);
      expect(result).toBe(0);
    });

    it("should return 0 when no expense transactions", () => {
      const income = mockTransactions.filter((t) => t.type === "income");
      const result = calculationService.calculateTotalExpenses(income);
      expect(result).toBe(0);
    });

    it("should handle decimal amounts correctly", () => {
      const transactions: Transaction[] = [
        {
          ...mockTransactions[2],
          amount: 10.99,
        },
        {
          ...mockTransactions[3],
          amount: 20.49,
        },
      ];
      const result = calculationService.calculateTotalExpenses(transactions);
      expect(result).toBeCloseTo(31.48, 2);
    });
  });

  describe("calculateNetBalance", () => {
    it("should calculate net balance (income - expenses)", () => {
      const result = calculationService.calculateNetBalance(mockTransactions);
      expect(result).toBe(3269.5); // 3500 - 230.5
    });

    it("should return 0 for empty array", () => {
      const result = calculationService.calculateNetBalance([]);
      expect(result).toBe(0);
    });

    it("should return positive balance when income > expenses", () => {
      const result = calculationService.calculateNetBalance(mockTransactions);
      expect(result).toBeGreaterThan(0);
    });

    it("should return negative balance when expenses > income", () => {
      const transactions: Transaction[] = [
        {
          ...mockTransactions[0],
          amount: 100,
          type: "income",
        },
        {
          ...mockTransactions[2],
          amount: 200,
          type: "expense",
        },
      ];
      const result = calculationService.calculateNetBalance(transactions);
      expect(result).toBe(-100);
    });
  });

  describe("calculateCategoryBreakdown", () => {
    it("should calculate breakdown for expense transactions", () => {
      const result = calculationService.calculateCategoryBreakdown(
        mockTransactions,
        "expense",
      );

      expect(result).toHaveLength(2); // food and transport
      expect(result[0].categoryId).toBe("food"); // Highest amount first
      expect(result[0].amount).toBe(200.5); // 50.5 + 150
      expect(result[0].transactionCount).toBe(2);
      expect(result[0].percentage).toBeCloseTo(87, 0); // ~87% of total expenses

      expect(result[1].categoryId).toBe("transport");
      expect(result[1].amount).toBe(30);
      expect(result[1].transactionCount).toBe(1);
      expect(result[1].percentage).toBeCloseTo(13, 0); // ~13% of total expenses
    });

    it("should calculate breakdown for income transactions", () => {
      const result = calculationService.calculateCategoryBreakdown(
        mockTransactions,
        "income",
      );

      expect(result).toHaveLength(2); // salary and freelance
      expect(result[0].categoryId).toBe("salary"); // Highest amount first
      expect(result[0].amount).toBe(3000);
      expect(result[0].percentage).toBeCloseTo(85.7, 1);

      expect(result[1].categoryId).toBe("freelance");
      expect(result[1].amount).toBe(500);
      expect(result[1].percentage).toBeCloseTo(14.3, 1);
    });

    it("should calculate breakdown for all transactions", () => {
      const result = calculationService.calculateCategoryBreakdown(
        mockTransactions,
        "all",
      );

      expect(result).toHaveLength(4); // salary, freelance, food, transport
      expect(result[0].categoryId).toBe("salary"); // Highest amount
      expect(result[0].amount).toBe(3000);
    });

    it("should return empty array when no transactions", () => {
      const result = calculationService.calculateCategoryBreakdown(
        [],
        "expense",
      );
      expect(result).toEqual([]);
    });

    it("should sort by amount descending", () => {
      const result = calculationService.calculateCategoryBreakdown(
        mockTransactions,
        "expense",
      );

      for (let i = 0; i < result.length - 1; i++) {
        expect(result[i].amount).toBeGreaterThanOrEqual(result[i + 1].amount);
      }
    });

    it("should include category names from category service", () => {
      const result = calculationService.calculateCategoryBreakdown(
        mockTransactions,
        "expense",
      );

      result.forEach((breakdown) => {
        expect(breakdown.categoryName).toBeTruthy();
        expect(typeof breakdown.categoryName).toBe("string");
      });
    });

    it("should calculate percentages that sum to 100", () => {
      const result = calculationService.calculateCategoryBreakdown(
        mockTransactions,
        "expense",
      );

      const totalPercentage = result.reduce(
        (sum, item) => sum + item.percentage,
        0,
      );
      expect(totalPercentage).toBeCloseTo(100, 0);
    });
  });

  describe("calculateDashboardSummary", () => {
    it("should calculate complete dashboard summary for a period", () => {
      const result = calculationService.calculateDashboardSummary(
        mockTransactions,
        {
          type: "month",
          anchorDate: "2026-02-15",
        },
      );

      expect(result.totalIncome).toBe(3500);
      expect(result.totalExpenses).toBe(230.5);
      expect(result.netBalance).toBe(3269.5);
      expect(result.period.type).toBe("month");
      expect(result.period.start).toBe("2026-02-01");
      expect(result.period.end).toBe("2026-02-28");
      expect(result.categoryBreakdown).toHaveLength(4);
      expect(result.transactionCount.income).toBe(2);
      expect(result.transactionCount.expense).toBe(3);
      expect(result.transactionCount.total).toBe(5);
    });

    it("should filter transactions by date range", () => {
      const transactions: Transaction[] = [
        {
          ...mockTransactions[0],
          date: "2026-01-15", // January
        },
        {
          ...mockTransactions[1],
          date: "2026-02-01", // February
        },
        {
          ...mockTransactions[2],
          date: "2026-02-15", // February
        },
      ];

      const result = calculationService.calculateDashboardSummary(
        transactions,
        {
          type: "month",
          anchorDate: "2026-02-10",
        },
      );

      // Should only include February transactions
      expect(result.transactionCount.total).toBe(2);
      expect(result.totalIncome).toBe(500);
      expect(result.totalExpenses).toBe(50.5);
    });

    it("should handle day period", () => {
      const result = calculationService.calculateDashboardSummary(
        mockTransactions,
        {
          type: "day",
          anchorDate: "2026-02-01",
        },
      );

      expect(result.period.type).toBe("day");
      expect(result.period.start).toBe("2026-02-01");
      expect(result.period.end).toBe("2026-02-01");
      // Should only include transactions from Feb 1
      expect(result.transactionCount.total).toBe(2); // salary and lunch
    });

    it("should handle week period", () => {
      const result = calculationService.calculateDashboardSummary(
        mockTransactions,
        {
          type: "week",
          anchorDate: "2026-02-01", // Sunday
        },
      );

      expect(result.period.type).toBe("week");
      // Week should be Monday to Sunday (Feb 1 is Sunday, so week is Jan 26 - Feb 1)
      expect(result.period.start).toBe("2026-01-26"); // Previous Monday
      expect(result.period.end).toBe("2026-02-01"); // This Sunday
    });

    it("should return zero values for empty period", () => {
      const result = calculationService.calculateDashboardSummary([], {
        type: "month",
        anchorDate: "2026-02-01",
      });

      expect(result.totalIncome).toBe(0);
      expect(result.totalExpenses).toBe(0);
      expect(result.netBalance).toBe(0);
      expect(result.categoryBreakdown).toEqual([]);
      expect(result.transactionCount.total).toBe(0);
    });
  });

  describe("getDateRangeForPeriod", () => {
    it('should return single day for "day" type', () => {
      const result = calculationService.getDateRangeForPeriod(
        "day",
        "2026-02-15",
      );

      expect(result.start).toBe("2026-02-15");
      expect(result.end).toBe("2026-02-15");
    });

    it('should return Monday-Sunday for "week" type', () => {
      const result = calculationService.getDateRangeForPeriod(
        "week",
        "2026-02-05",
      ); // Thursday

      expect(result.start).toBe("2026-02-02"); // Monday
      expect(result.end).toBe("2026-02-08"); // Sunday
    });

    it('should return full month for "month" type', () => {
      const result = calculationService.getDateRangeForPeriod(
        "month",
        "2026-02-15",
      );

      expect(result.start).toBe("2026-02-01");
      expect(result.end).toBe("2026-02-28");
    });

    it("should handle leap year February", () => {
      const result = calculationService.getDateRangeForPeriod(
        "month",
        "2024-02-15",
      );

      expect(result.start).toBe("2024-02-01");
      expect(result.end).toBe("2024-02-29"); // Leap year
    });

    it("should handle Date objects", () => {
      const result = calculationService.getDateRangeForPeriod(
        "day",
        new Date("2026-02-15"),
      );

      expect(result.start).toBe("2026-02-15");
      expect(result.end).toBe("2026-02-15");
    });

    it("should handle 31-day months", () => {
      const result = calculationService.getDateRangeForPeriod(
        "month",
        "2026-01-15",
      );

      expect(result.start).toBe("2026-01-01");
      expect(result.end).toBe("2026-01-31");
    });

    it("should handle 30-day months", () => {
      const result = calculationService.getDateRangeForPeriod(
        "month",
        "2026-04-15",
      );

      expect(result.start).toBe("2026-04-01");
      expect(result.end).toBe("2026-04-30");
    });
  });
});
