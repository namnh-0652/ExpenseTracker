# Implementation Plan: Maintenance & UI Polish Phase

**Branch**: `002-maintenance-polish` | **Date**: February 2, 2026 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-maintenance-polish/spec.md`

## Summary

This maintenance phase focuses on improving code quality (fixing all TypeScript errors), enhancing the user interface with modern features (header/footer, tab navigation, dark theme), and adding delightful interactions (income celebration animation). The primary goal is to elevate the application from a functional prototype to a polished, production-ready product while maintaining all existing functionality and test coverage.

**Technical Approach**:
- Fix TypeScript errors systematically (types → utils → components → tests)
- Use CSS custom properties for theming system
- Implement tab navigation with React state (no router overhead)
- Create celebration animation with CSS keyframes
- Maintain 100% test pass rate throughout changes

## Technical Context

**Language/Version**: TypeScript 5.6.2, React 18.3  
**Primary Dependencies**: React 18, Vite 7.3, Vitest 4.0, CSS3  
**Storage**: Browser localStorage (no database)  
**Testing**: Vitest (179 existing tests must continue passing)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge latest versions)  
**Project Type**: Single-page web application (SPA)  
**Performance Goals**: 
- 60fps animations on mid-range devices
- Theme toggle < 100ms response
- Tab switching < 1 second
- Bundle size increase < 50KB gzipped  

**Constraints**: 
- All existing 179+ tests must pass
- Zero TypeScript compilation errors
- WCAG AA contrast ratios in both themes
- Respect prefers-reduced-motion for accessibility
- No breaking changes to existing features

**Scale/Scope**: 
- Single user application (localStorage persistence)
- ~5,000 lines of existing code
- 6 user stories to implement
- 35 functional requirements
- Maintain all Phase 1-7 functionality

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Gates (ERROR if violated without justification):**
✅ **Data integrity**: No changes to transaction storage format  
✅ **Performance**: Bundle increase limited to <50KB gzipped  
✅ **Testing**: All 179+ tests must continue passing  
✅ **Data ownership**: Client-side only (localStorage), no backend dependencies  
✅ **Backward compatibility**: No breaking changes to existing features

**Status**: All gates expected to pass. This is a non-breaking maintenance phase.

## Project Structure

### Documentation (this feature)

```text
specs/002-maintenance-polish/
├── spec.md              # Feature specification (DONE)
├── plan.md              # This file (IN PROGRESS)
├── research.md          # Phase 0: TS error audit + existing code analysis
├── data-model.md        # Phase 1: Theme context + Tab state models
├── quickstart.md        # Phase 1: Maintenance phase dev setup
├── contracts/           # Phase 1: Theme + Tab interface contracts
└── tasks.md             # Phase 2: Granular task breakdown
```

### Source Code (existing single-page application)

```text
src/
├── features/
│   ├── dashboard/           # [EXISTING] Dashboard view
│   ├── transactions/        # [EXISTING] Transaction management
│   ├── filters/             # [EXISTING] Filter controls
│   ├── export/              # [EXISTING] CSV export
│   └── theme/               # [NEW] Theme provider + context
│       ├── ThemeContext.tsx
│       ├── ThemeProvider.tsx
│       └── useTheme.ts
├── shared/
│   ├── components/
│   │   ├── ConfirmDialog/   # [EXISTING]
│   │   ├── ErrorBoundary/   # [EXISTING]
│   │   ├── Header/          # [NEW] App header with branding + theme toggle
│   │   ├── Footer/          # [NEW] App footer with credits
│   │   ├── TabNav/          # [NEW] Tab navigation component
│   │   └── IncomeAnimation/ # [NEW] Celebration animation for income
│   ├── constants/           # [EXISTING] - add theme constants
│   ├── services/            # [EXISTING]
│   ├── types/               # [EXISTING] - fix TS errors, add theme types
│   └── hooks/               # [NEW]
│       ├── useTheme.ts      # Theme hook (from context)
│       └── useLocalStorage.ts # Generic localStorage hook
├── styles/
│   ├── index.css            # [EXISTING] - convert to CSS variables
│   ├── themes.css           # [NEW] Light/dark theme definitions
│   └── animations.css       # [NEW] Celebration animations
├── App.tsx                  # [MODIFY] Add Header, Footer, TabNav, theme provider
└── main.tsx                 # [EXISTING] Entry point with ErrorBoundary

tests/
├── features/                # [EXISTING] - fix TS errors
│   ├── dashboard/
│   ├── transactions/
│   ├── filters/
│   └── export/
├── shared/                  # [EXISTING] - fix TS errors + add new component tests
│   ├── components/
│   │   ├── Header.test.tsx       # [NEW]
│   │   ├── Footer.test.tsx       # [NEW]
│   │   ├── TabNav.test.tsx       # [NEW]
│   │   └── IncomeAnimation.test.tsx # [NEW]
│   └── hooks/
│       ├── useTheme.test.tsx         # [NEW]
│       └── useLocalStorage.test.tsx  # [NEW]
└── App.test.tsx             # [MODIFY] Test tab navigation + theme
```

**Structure Decision**: Single-project layout with feature-based organization. New `theme/` feature for dark mode, new `hooks/` directory for shared React hooks, new `styles/` directory for global theme CSS. All new components follow existing patterns (component folder with .tsx + .css files).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Gate | Status | Justification (if violated) |
|------|--------|----------------------------|
| Data integrity | ✅ PASS | No changes to transaction storage |
| Performance | ✅ PASS | Adding ~15-20KB for theme + animations (within 50KB limit) |
| Testing | ✅ PASS | All existing tests maintained + new tests added |
| Data ownership | ✅ PASS | Client-side only, localStorage for theme/tab preferences |
| Backward compatibility | ✅ PASS | Additive changes only, no breaking changes |

**Notes**: No constitution violations expected. This is a quality improvement phase that enhances existing functionality without breaking changes.
