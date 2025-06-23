# NOBI Form - Liferay Client Extension

A React-based Liferay Client Extension web component for NOBI request form submission with integrated dropdown data and Liferay authentication.

## Overview

This client extension provides a web component (`<nobi-form>`) that renders a comprehensive form for submitting NOBI requests. The form dynamically loads company and NOBI category data from Liferay's headless admin APIs and submits requests to the NOBI requests collection.

## Features

- **Client-side only**: No server-side dependencies, deployed as a Liferay Client Extension
- **Dynamic data loading**: Fetches companies and NOBI categories from Liferay APIs
- **Liferay authentication**: Uses Liferay.authToken for secure API calls
- **Responsive design**: Uses Liferay global CSS variables for consistent styling
- **Form validation**: Required field validation and error handling
- **Web component**: Custom HTML element `<nobi-form>` for easy integration

## API Integration

The extension integrates with the following Liferay APIs:

1. **Company Data**: `/o/headless-admin-list-type/v1.0/list-type-definitions/334341`
2. **NOBI Categories**: `/o/headless-admin-list-type/v1.0/list-type-definitions/334543`
3. **Form Submission**: `/o/c/nobprequests/`

All API calls are authenticated using `?p_auth={Liferay.authToken}`.

## Build Files

The client extension consists of:
- `build/nobi-form.js` - The main JavaScript bundle
- `build/nobi-form.css` - Styles that complement Liferay's global CSS
- `client-extension.yaml` - Client extension configuration

## Form Fields

The form includes all fields from the example POST body:
- Company (dropdown - required)
- NOBI Category (dropdown - required)
- Requestor information (first name, surname - required)
- Contact details (company number, contact number)
- Financial information (cost centre, currency, amounts)
- Date (required)
- Vendor information (SAP vendor details, addresses)
- Additional details (line manager, bank account, department/store)

## Deployment

1. Copy the entire project to your Liferay workspace
2. Deploy using Liferay's client extension deployment process
3. The web component will be available as `<nobi-form>` in your Liferay instance

## Development

To modify the extension:

1. Edit React components in `src/components/`
2. Update styles in `src/nobi-form.css`
3. Rebuild using: `npx vite build --config vite.client-extension.config.ts`
4. Copy CSS to build: `cp src/nobi-form.css build/`

## Usage in Liferay

Once deployed, add the NOBI form element to any page or template:

```html
<nobi-form></nobi-form>
```

The component will automatically load the required data and render the form.