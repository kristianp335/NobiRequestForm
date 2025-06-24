# Project Documentation

## Overview

This project is a React-based Liferay Client Extension web component for NOBI (Not Ordinarily Booked Invoices) request form submission. The application is completely client-side and integrates with Liferay's headless admin APIs to fetch company and category data, then submits form data to the NOBI requests collection endpoint. The extension is designed to be deployed locally to a Liferay instance as a custom web component.

## System Architecture

The application is a client-side React Liferay Client Extension with the following key characteristics:

- **Web Component Architecture**: Custom HTML element (`<nobi-form>`) built with React
- **Client-Side Only**: No server dependencies, runs entirely in the browser
- **Liferay API Integration**: Connects to Liferay's headless admin APIs for data
- **Shadow DOM Encapsulation**: Uses Shadow DOM for style isolation
- **Authentication Integration**: Uses Liferay.authToken for secure API calls

## Key Components

### 1. NOBI Form Web Component
- Custom HTML element `<nobi-form>` built with React
- Shadow DOM encapsulation for style isolation
- Responsive design using Liferay global CSS variables
- Form validation and error handling

### 2. Dynamic Data Loading
- Fetches company data from `/o/headless-admin-list-type/v1.0/list-type-definitions/334341`
- Loads NOBI categories from `/o/headless-admin-list-type/v1.0/list-type-definitions/334543`
- Real-time API integration with Liferay authentication

### 3. Form Management
- Comprehensive form with all required NOBI fields
- Company and NOBI category dropdowns (required fields)
- Financial data entry (amounts, currency, cost centers)
- Vendor information management (SAP integration ready)

### 4. Client Extension Structure
- `client-extension.yaml` configuration for Liferay deployment
- Build artifacts: `nobi-form.js` and `nobi-form.css`
- TypeScript/React development stack with Vite bundling

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

- June 24, 2025: Made all form fields required with validation
- Auto-fills requestor names from user account API (/o/headless-admin-user/v1.0/my-user-account)
- Auto-generates random 4-digit company number when company is selected
- Updated all primary colors (page indicators, section title borders, progress bar) to use var(--btn-primary-background-color)
- Enhanced form with impactful animations: dramatic initial load, colorful page transitions, and glowing section titles
- Added smooth page transition animations with fade-in slide effects
- Implemented attractive amount field validation (2 decimal places, £100,000 limit)
- Removed default zero values from amount fields, using placeholders instead
- Added dark mode toggle with complete styling for all form elements and validation states
- Enhanced progress bar animation with more vibrant shimmer effect and faster timing
- Converted to multi-page form with progress tracking and currency dropdown
- Added currency select with Liferay SVG icons based on locale codes that submits symbols only
- Moved requestor fields to top and split form into "About You" and "About the Vendor" sections
- Implemented animated progress bar showing completion percentage
- Added page navigation with Previous/Next buttons and visual page indicators
- Moved financial fields and category selection to bottom of form
- Reordered form fields to match exact sequence from example JSON structure
- Converted to use standard Liferay CSS classes (sheet, form-group, control-label, etc.)
- Reduced custom CSS from 140 lines to minimal 4 lines
- Fixed Shadow DOM conflict error when multiple client extensions on same page
- Removed Shadow DOM usage and switched to regular DOM
- Added initialization checks to prevent React root conflicts
- Fixed client-extension.yaml YAML formatting issues
- Resolved Windows build compatibility by removing Unix-specific commands
- Successfully tested build process - generates 556KB JavaScript bundle
- June 23, 2025: Created React-based Liferay Client Extension for NOBI form
- Built web component with Shadow DOM encapsulation
- Integrated with Liferay headless admin APIs for dynamic data loading

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