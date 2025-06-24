# NOBI Request Form - Liferay Client Extension

A modern, interactive React-based Liferay Client Extension for submitting NOBI (Not Ordinarily Booked Invoices) requests. Features a multi-page form with advanced animations, dark mode support, and seamless Liferay integration.

## Features

### Core Functionality
- **Multi-page Form**: Intuitive 2-page layout with "About You" and "About the Vendor" sections
- **Real-time Validation**: Comprehensive field validation with visual feedback
- **Auto-calculation**: Invoice Net + VAT = Total Price (automatic calculation)
- **Dynamic Data Loading**: Fetches companies and NOBI categories from Liferay APIs
- **Auto-population**: User details and random company numbers generated automatically

### User Experience
- **Smooth Animations**: Dramatic initial load and page transitions with blur effects
- **Progress Tracking**: Animated progress bar with shimmer effects
- **Dark Mode**: Complete theme toggle with localStorage persistence
- **Visual Indicators**: Glowing section titles and pulsing page dots
- **Currency Support**: 21 international currencies with Liferay SVG flag icons

### Technical Integration
- **Liferay Authentication**: Uses `Liferay.authToken` for secure API calls
- **Headless Admin APIs**: Integrates with list type definitions for dynamic data
- **Client Extension**: Deploys as custom web component `<nobi-form>`
- **Shadow DOM**: Isolated styling prevents conflicts with other extensions
- **Responsive Design**: Works across desktop and mobile devices

## Quick Start

### Deployment
1. Copy the entire project to your Liferay workspace
2. Deploy using Liferay's client extension deployment process
3. Add `<nobi-form></nobi-form>` to any page or template

### Build Files
- `build/nobi-form.js` - Main JavaScript bundle (579KB)
- `build/nobi-form.css` - Complementary styles
- `client-extension.yaml` - Client extension configuration

## Form Fields

### Page 1: About You
- **Requestor Information**: First name, surname (auto-populated from user account)
- **Company Details**: Company selection with auto-generated 4-digit number
- **Contact Information**: Phone number, cost centre
- **Request Details**: Department/store, date, line manager

### Page 2: About the Vendor
- **Vendor Information**: SAP vendor details, name, address
- **Financial Details**: 
  - Currency selection (21 currencies with flag icons)
  - Invoice Net Amount (validates 2 decimal places, £100k limit)
  - Invoice VAT Amount (validates 2 decimal places, £100k limit)
  - Total Price (auto-calculated, read-only)
- **Additional Details**: NOBI category, bank account, general ledger

## API Integration

### Data Sources
- **Companies**: `/o/headless-admin-list-type/v1.0/list-type-definitions/334341`
- **NOBI Categories**: `/o/headless-admin-list-type/v1.0/list-type-definitions/334543`
- **User Account**: `/o/headless-admin-user/v1.0/my-user-account`

### Submission Endpoint
- **NOBI Requests**: `/o/headless-delivery/v1.0/sites/{siteId}/structured-contents`
- **Authentication**: All requests include `?p_auth=${authToken}`
- **Format**: JSON payload matching Liferay structured content schema

## Validation Rules

### Amount Fields
- Must contain exactly 2 decimal places (e.g., 123.45)
- Maximum limit of £100,000
- Cannot be negative values
- Real-time validation with visual error indicators

### Required Fields
All form fields are mandatory with comprehensive validation:
- Dropdown selections must be made
- Text fields cannot be empty
- Amount fields must be properly formatted

## Development

### Build Process
```bash
npm install
npm run build
```

### File Structure
```
src/
├── components/
│   └── NOBIFormApp.tsx     # Main React component
├── main.tsx                # Web component entry point
└── nobi-form.css          # Base styles

build/
├── nobi-form.js           # Compiled JavaScript
└── nobi-form.css          # Production styles
```

### Customization
- **Colors**: Uses Liferay CSS variables (`--btn-primary-background-color`)
- **Animation Timing**: Configurable via CSS custom properties
- **Currency List**: Easily extendable in `currencies` array
- **Validation Rules**: Modifiable in `validateAmount` function

## Browser Support

- Modern browsers with ES6+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android

## Dependencies

- React 18+ with TypeScript
- Vite for build process
- Liferay DXP/Portal 7.4+

## Security

- All API calls authenticated with Liferay tokens
- Input validation prevents malicious data entry
- Client-side only, no server-side data storage
- CSRF protection via Liferay authentication

## Performance

- Optimized bundle size: 579KB (101KB gzipped)
- Lazy loading of API data
- Efficient re-renders with React state management
- CSS animations use hardware acceleration

## License

This project is proprietary software for use with Liferay DXP/Portal.

## Support

For technical support or feature requests, contact your Liferay administrator.