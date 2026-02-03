# 💰 Expense Tracker

A modern, full-featured expense tracking application built with React, TypeScript, and Vite. Track your income and expenses, visualize spending patterns, filter transactions, and export data to CSV.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Tests](https://img.shields.io/badge/tests-179%20passing-success)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![React](https://img.shields.io/badge/React-18-blue)

## ✨ Features

### 📊 Dashboard
- **Summary Cards**: Total income, expenses, and balance at a glance
- **Time Filters**: View data by All Time, This Month, Last 30 Days, This Year
- **Recent Transactions**: Quick view of your latest 5 transactions

### 💸 Transaction Management
- **CRUD Operations**: Create, read, update, and delete transactions
- **Form Validation**: Real-time validation with helpful error messages
- **Transaction Types**: Track both income and expenses
- **Categories**: 10 expense categories and 6 income categories with icons

### 🔍 Advanced Filtering
- **Search**: Find transactions by description (debounced for performance)
- **Type Filter**: Filter by income, expense, or all
- **Category Filter**: Filter by specific categories
- **Date Range**: Filter by start/end date
- **Sorting**: Sort by date, amount, or category (ascending/descending)
- **Active Filter Badge**: Shows count of active filters

### 📥 Data Export
- **CSV Export**: Export filtered transactions to CSV format
- **RFC 4180 Compliant**: Proper escaping of special characters
- **Success Feedback**: Visual confirmation of export
- **Timestamped Files**: Automatic filename generation with date/time

### 🎨 User Experience
- **Responsive Design**: Works on mobile (320px+), tablet, and desktop
- **Confirmation Dialogs**: Prevents accidental deletions
- **Error Boundaries**: Graceful error handling
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Escape)
- **Accessibility**: ARIA labels and semantic HTML

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.19+ or v22.12+
- **npm**: v10+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ExpenseTracker

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Build for production
npm run preview      # Preview production build locally

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage report

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## 🏗️ Project Structure

```
ExpenseTracker/
├── src/
│   ├── features/              # Feature-based modules
│   │   ├── dashboard/         # Dashboard views and calculations
│   │   ├── transactions/      # Transaction CRUD operations
│   │   ├── filters/           # Search and filter logic
│   │   └── export/            # CSV export functionality
│   ├── shared/                # Shared utilities and components
│   │   ├── components/        # Reusable components
│   │   ├── constants/         # Constants and configuration
│   │   ├── services/          # Business logic services
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── App.tsx                # Main application component
│   └── main.tsx               # Application entry point
├── tests/                     # Test files (mirrors src structure)
├── public/                    # Static assets
└── specs/                     # Project specifications

```

## 🧪 Testing

The project has comprehensive test coverage with **179 passing tests**:

- **Validation Utils**: 26 tests
- **Transaction Service**: 29 tests
- **Date Utils**: 28 tests
- **Calculation Service**: 31 tests
- **Filter Service**: 37 tests
- **Export Service**: 28 tests

Run tests:
```bash
npm test              # Watch mode
npm run test:run      # Single run
npm run test:coverage # With coverage
```

## 🎯 Key Technologies

- **React 18**: Modern React with hooks
- **TypeScript 5.6**: Full type safety
- **Vite 7.3**: Lightning-fast build tool
- **Vitest 4.0**: Fast unit testing
- **LocalStorage**: Client-side data persistence
- **CSS3**: Modern styling with animations

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔧 Configuration

### Environment Variables

No environment variables required. The app uses browser localStorage for data persistence.

### Build Configuration

Vite configuration can be customized in `vite.config.ts`:
- Path aliases (@/ for src/)
- Build optimization
- Test environment setup

### TypeScript Configuration

TypeScript is configured with:
- Strict mode enabled
- Path aliases
- React JSX support
- ESNext target

## 📊 Performance

- **Bundle Size**: Optimized with tree-shaking and code splitting
- **Load Time**: Fast initial load with Vite
- **Runtime**: Efficient with useMemo and debouncing
- **Tested**: Validated with 10,000+ transactions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow existing code style
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Icons: Emoji icons for visual appeal
- Design: Inspired by modern fintech applications
- Testing: Vitest for comprehensive test coverage

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review test files for usage examples

---

**Built with ❤️ using React + TypeScript + Vite**

