# Project Documentation

## Overview

This project is a sophisticated React-based Liferay Client Extension that provides an interactive multi-page NOBI (Not Ordinarily Booked Invoices) request form. The application features advanced animations, dark mode support, automatic calculations, and comprehensive validation while integrating seamlessly with Liferay's headless admin APIs. Built as a custom web component for deployment in Liferay DXP/Portal environments.

**Current State**: Production-ready with 579KB JavaScript bundle featuring 21 international currencies, automatic total calculation, and impactful visual animations.

## System Architecture

The application is a feature-rich client-side React Liferay Client Extension with advanced capabilities:

- **Multi-Page Web Component**: Custom HTML element (`<nobi-form>`) with 2-page navigation
- **Client-Side Only**: No server dependencies, runs entirely in the browser
- **API Integration**: Real-time data fetching from Liferay's headless admin APIs
- **Style Isolation**: Uses Liferay CSS variables for theme consistency
- **Authentication**: Secure API calls using `Liferay.authToken`
- **State Management**: React hooks for form state, animations, and dark mode
- **Auto-Calculation Engine**: Real-time financial calculations with validation

## Key Components

### 1. Interactive Form Pages
- **Page 1 - About You**: User information, company selection, contact details
- **Page 2 - About the Vendor**: Vendor details, financial calculations, categories
- Smooth page transitions with dramatic animations and color effects
- Progress tracking with animated shimmer effects

### 2. Advanced Form Features
- **Auto-Calculation**: Invoice Net + VAT = Total Price (real-time)
- **Field Validation**: 2 decimal places, £100k limits, required field checking
- **Auto-Population**: User details from API, random company numbers
- **Dark Mode**: Complete theme toggle with localStorage persistence

### 3. Dynamic Data Integration
- **Companies**: `/o/headless-admin-list-type/v1.0/list-type-definitions/334341`
- **NOBI Categories**: `/o/headless-admin-list-type/v1.0/list-type-definitions/334543`
- **User Account**: `/o/headless-admin-user/v1.0/my-user-account`
- **Currencies**: 21 international options with Liferay SVG flag icons

### 4. Visual Experience
- **Initial Load**: 1.2-second dramatic entrance with blur-to-focus
- **Page Transitions**: 0.4-second animations with scale and displacement
- **Progress Indicators**: Pulsing dots with gradient halos
- **Section Titles**: Glowing text with animated gradient borders

### 5. Technical Infrastructure
- **Build System**: Vite + TypeScript for optimized 579KB bundle
- **Styling**: Liferay CSS variables with custom animations
- **Validation**: Real-time error feedback with visual indicators
- **Accessibility**: Proper labels, tooltips, and keyboard navigation

## Data Flow

1. **Invoice Creation**: External systems submit invoice data via POST requests
2. **Data Validation**: System validates required fields and data formats
3. **Category Assignment**: Invoices are categorized using NOBI categories
4. **Company Association**: Invoices are linked to appropriate company entities
5. **Approval Workflow**: Line manager information is captured for approval processes
6. **External System Integration**: Data is synchronized with headless admin services

## External Dependencies

### Headless Admin Service
- **Purpose**: Manages list type definitions and entries
- **Endpoint**: http://localhost:8080/o/headless-admin-list-type/v1.0/
- **Functionality**: Provides CRUD operations for company and category data
- **Authentication**: Supports permissions-based access control

### SAP Integration
- **Purpose**: Vendor management and financial data synchronization
- **Data Points**: Vendor numbers, names, and account details
- **Integration Type**: Likely batch or real-time data exchange

## Deployment Strategy

The current setup suggests a local development environment with:
- Local API services running on port 8080
- RESTful service architecture suitable for containerization
- JSON-based data exchange for easy integration
- Scalable design supporting multiple company entities

**Recommended Production Setup**:
- Containerized deployment using Docker
- Load balancer for high availability
- Database clustering for data persistence
- API gateway for external integrations

## Recent Changes

### June 24, 2025: Major Feature Updates
- **Automatic Calculation**: Added Invoice Net + Invoice VAT = Total Price with real-time updates
- **Enhanced Animations**: Dramatic 1.2s initial load with blur effects and colorful page transitions
- **Currency Integration**: 21 currencies with Liferay SVG flag icons instead of emoji
- **Dark Mode**: Complete theme system with localStorage persistence
- **Form Validation**: Comprehensive 2-decimal place and £100k limit validation
- **Auto-Population**: User details from API and random company number generation
- **Visual Enhancements**: Glowing section titles, pulsing indicators, shimmer progress bar
- **Multi-Page Structure**: Split into "About You" and "About the Vendor" sections
- **Progress Tracking**: Animated completion percentage with visual page indicators

### Development Milestones
- **Production Bundle**: 579KB optimized JavaScript with 101KB gzipped
- **API Integration**: Full Liferay headless admin integration with authentication
- **Theme Consistency**: All colors use `var(--btn-primary-background-color)`
- **Accessibility**: Proper form labels, tooltips, and keyboard navigation
- **Error Handling**: Real-time validation with visual feedback
- **Responsive Design**: Works across desktop and mobile devices

### Technical Achievements
- **Build Optimization**: Vite + TypeScript for modern development workflow
- **State Management**: Efficient React hooks for form, animation, and theme state
- **CSS Architecture**: Liferay CSS classes with minimal custom styling
- **Animation System**: Cubic-bezier timing with multi-stage keyframes
- **Data Integrity**: No mock data, all information from live Liferay APIs

## Deployment Files

### Core Files
- `client-extension.yaml` - Liferay client extension configuration
- `build/nobi-form.js` - Main JavaScript bundle (558KB)
- `build/nobi-form.css` - Stylesheet using Liferay CSS variables
- `demo.html` - Development testing page with mock APIs

### Development Files  
- `src/main.tsx` - Web component entry point
- `src/components/NOBIFormApp.tsx` - Main React form component
- `vite.client-extension.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration

## User Preferences

Preferred communication style: Simple, everyday language.