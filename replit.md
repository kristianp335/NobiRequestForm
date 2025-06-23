# Project Documentation

## Overview

This project appears to be a backend system for managing business expenses and invoices, specifically designed for a company structure that includes Boots UK and related entities. The system handles invoice processing, vendor management, and financial categorization through a structured API approach. Based on the attached JSON files, this is likely a REST API service that integrates with external systems for expense management and approval workflows.

## System Architecture

The application follows a service-oriented architecture with the following key characteristics:

- **API-First Design**: The system exposes RESTful endpoints for managing financial data
- **External Integration**: Connects to headless admin services (port 8080) for list management
- **Structured Data Model**: Uses consistent JSON schemas for data exchange
- **Multi-tenant Support**: Supports multiple company entities within the same system

## Key Components

### 1. Invoice Management System
- Handles invoice creation, updates, and retrieval
- Supports multiple currencies and VAT calculations
- Tracks invoice net amounts and VAT amounts separately

### 2. Company Management
- Manages company hierarchies (Boots UK, Boots Management Services, Boots ROI)
- Supports external reference codes for system integration
- Provides key-based company identification

### 3. Category Management (NOBI Categories)
- Handles expense categorization (Charitable donations, Customer complaints, Legal proceedings)
- Supports internationalization (i18n) for category names
- Uses key-based category identification for consistency

### 4. Vendor Management
- Tracks SAP vendor information including names and numbers
- Manages vendor address details and contact information
- Supports multiple bank account configurations

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

## Changelog

- June 23, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.