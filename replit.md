# Jay's Frames POS System

## Overview

Jay's Frames POS System is a comprehensive point-of-sale and framing management solution designed specifically for picture framing businesses. The system handles customer management, order processing, inventory tracking, pricing calculations, and production workflow management. Built with TypeScript, React, and PostgreSQL, it provides a modern web-based interface for managing all aspects of a framing business operation.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **UI Library**: Radix UI components with Tailwind CSS styling
- **State Management**: React Query (@tanstack/react-query) for server state
- **Build Tool**: Vite with custom configuration for development and production
- **Component System**: Modular component architecture with shared UI components

### Backend Architecture
- **Runtime**: Node.js with TypeScript execution via tsx
- **Framework**: Express.js with custom middleware
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with WebSocket support for real-time updates
- **Authentication**: API key-based authentication for external integrations

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)
- **Schema Management**: Centralized schema definitions in `shared/schema.ts`
- **Migration System**: Drizzle Kit for database migrations
- **Connection Pooling**: Neon serverless connection pooling

## Key Components

### Core Business Logic
1. **Customer Management**: Customer creation, tracking, and notification systems
2. **Order Processing**: Complete order lifecycle from creation to completion
3. **Pricing Engine**: Advanced pricing calculations with sliding scale markups
4. **Inventory Management**: Material tracking, supplier management, and purchase orders
5. **Production Workflow**: Order status tracking and kanban-style production management

### Integration Services
1. **Email Service**: SendGrid integration for customer communications
2. **SMS Service**: Twilio integration for text notifications
3. **Payment Processing**: Stripe integration for payment links and processing
4. **External APIs**: Vendor catalog integration and cross-vendor inventory checking

### Specialized Features
1. **Frame Recommendation Engine**: OpenAI-powered frame suggestions based on artwork
2. **QR Code System**: Order tracking and customer notifications via QR codes
3. **Wholesale Pricing**: Larson-Juhl catalog integration with optimization algorithms
4. **Multi-vendor Support**: Unified interface for multiple frame and material suppliers

## Data Flow

### Order Processing Flow
1. Customer creation or selection
2. Artwork details input (dimensions, description, image upload)
3. Frame, mat, and glass selection from catalogs
4. Pricing calculation using sophisticated markup algorithms
5. Order creation with production tracking
6. Status updates with automated customer notifications
7. Completion and pickup management

### Pricing Calculation Flow
1. Component selection (frame, mat, glass, services)
2. Wholesale price lookup from vendor catalogs
3. United inch calculation for dimension-based pricing
4. Markup application based on sliding scales
5. Labor and service cost addition
6. Final price presentation with breakdown

### Inventory Management Flow
1. Material ordering through integrated vendor systems
2. Stock level tracking with automated reorder points
3. Purchase order creation and tracking
4. Inventory consumption during order production
5. Supplier performance monitoring

## External Dependencies

### Required Services
- **PostgreSQL Database**: Primary data storage (Neon serverless recommended)
- **SendGrid**: Email delivery service
- **Twilio**: SMS notifications (optional)
- **Stripe**: Payment processing (optional)
- **OpenAI**: AI-powered recommendations (optional)

### Vendor Integrations
- **Larson-Juhl**: Frame catalog and wholesale pricing
- **Crescent**: Mat board catalog and pricing
- **Various Glass Suppliers**: Specialty glass options

### Development Dependencies
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast bundling for production deployment
- **Drizzle Kit**: Database schema management and migrations

## Deployment Strategy

### Production Build Process
The application uses a streamlined deployment process optimized for Replit:

1. **Server Compilation**: ESBuild bundles the TypeScript server into a single ESM module
2. **Client Build**: Vite handles frontend compilation with optimized asset bundling
3. **Runtime Execution**: Direct TypeScript execution via tsx for simplified deployment

### Environment Configuration
- **NODE_ENV**: Set to "production" for deployment
- **DATABASE_URL**: PostgreSQL connection string
- **API Keys**: Various service authentication tokens
- **Integration URLs**: External service endpoints

### Deployment Commands
- **Primary Build**: `node simple-deploy.mjs` - Creates production-ready bundle
- **Development**: `npm run dev` - Starts development server with hot reload
- **Production Start**: Direct TypeScript execution via `npx tsx server/index.ts`

### Scaling Considerations
- Stateless server design enables horizontal scaling
- Database connection pooling for efficient resource usage
- Modular service architecture allows for microservice extraction
- WebSocket connections for real-time features require sticky sessions

## Changelog
- June 17, 2025: Application fully operational and deployment-ready
  - Fixed critical order creation and storage issues
  - Resolved database authentication errors by creating new PostgreSQL database
  - Fixed "request entity too large" errors with automatic image compression
  - Added image compression utility that reduces uploads over 500KB to prevent server errors
  - Orders now save properly to database and appear in orders list and kanban board
  - Hidden frame preview section behind collapsible icon for cleaner interface
  - Resolved port conflicts and server startup issues with improved development scripts
  - Application running successfully on ports 5000 (backend) and 5173 (frontend)
  - Fixed order progress page display issues: totals now show correctly, "in_production" status displays properly
  - Added QR code functionality with material/artwork location tracking using Google Charts API
  - Implemented customer notification system with "Send Update" button (requires SendGrid credits)
  - QR codes display material locations (Workshop - Bay A) and artwork locations (Shelf #ID-ART)
- June 13, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.