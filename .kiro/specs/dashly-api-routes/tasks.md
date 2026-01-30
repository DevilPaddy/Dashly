# Implementation Plan: Dashly API Routes

## Overview

This implementation plan breaks down the Dashly API routes feature into discrete, manageable coding tasks. Each task builds incrementally on previous work, starting with core infrastructure and models, then services, and finally API routes. The plan includes comprehensive testing with both unit tests and property-based tests to ensure correctness and reliability.

## Tasks

- [x] 1. Set up core infrastructure and database models
  - Create MongoDB connection handler with proper error handling
  - Implement all Mongoose schemas with proper indexing
  - Set up TypeScript interfaces and types
  - _Requirements: 1.4, 6.5, 9.3_

- [x] 1.1 Create database connection utility
  - Implement MongoDB connection with connection pooling
  - Add graceful error handling and retry logic
  - _Requirements: 8.2_

- [x] 1.2 Implement User model with schema
  - Create User interface and Mongoose schema
  - Add proper indexing on googleId and email fields
  - _Requirements: 1.4_

- [x] 1.3 Implement OAuthToken model with encryption support
  - Create OAuthToken interface and Mongoose schema
  - Add indexing on userId and provider fields
  - _Requirements: 1.5, 6.1_

- [x] 1.4 Implement Task model with relationships
  - Create Task interface and Mongoose schema
  - Add indexing on userId, status, and dueDate fields
  - Support for linking to emails and calendar events
  - _Requirements: 4.1, 4.4, 4.5_

- [x] 1.5 Implement Note model with task relationships
  - Create Note interface and Mongoose schema
  - Add indexing on userId and tags fields
  - Support for bidirectional task linking
  - _Requirements: 5.1, 5.3, 5.4_

- [x] 1.6 Implement Email model with Gmail integration
  - Create Email interface and Mongoose schema
  - Add indexing on userId, gmailId, and receivedAt fields
  - _Requirements: 2.2, 2.3_

- [x] 1.7 Implement CalendarEvent model
  - Create CalendarEvent interface and Mongoose schema
  - Add indexing on userId, googleEventId, and startTime fields
  - _Requirements: 3.2, 3.3_

- [ ] 2. Implement core utility libraries
  - Create encryption service for OAuth tokens
  - Implement authentication helpers
  - Build Google API client wrapper
  - _Requirements: 1.2, 1.3, 1.5, 6.1_

- [x] 2.1 Create encryption service (crypto.ts)
  - Implement AES-256-GCM encryption and decryption functions
  - Add proper error handling and key validation
  - _Requirements: 1.5, 6.1_

- [ ] 2.2 Write property test for encryption service
  - **Property 1: OAuth Token Encryption Round-trip**
  - **Validates: Requirements 1.5, 6.1**

- [ ] 2.3 Implement authentication service (auth.ts)
  - Create getCurrentUser and requireAuth helper functions
  - Add session validation and user lookup
  - _Requirements: 1.2, 6.2_

- [ ] 2.4 Write property test for authentication service
  - **Property 2: Authentication and Ownership Validation**
  - **Validates: Requirements 1.2, 6.2**

- [ ] 2.5 Create Google API client wrapper (google.ts)
  - Implement OAuth2 client initialization
  - Add automatic token refresh functionality
  - Create Gmail and Calendar client getters
  - _Requirements: 1.3, 2.1, 3.1_

- [ ] 2.6 Write property test for token refresh
  - **Property 3: Token Refresh Mechanism**
  - **Validates: Requirements 1.3**

- [ ] 3. Checkpoint - Core infrastructure complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement business logic services
  - Create task management service
  - Implement note management service
  - Build email management service
  - Create calendar service
  - Implement sync orchestration service
  - _Requirements: 4.1-4.5, 5.1-5.5, 2.1-2.5, 3.1-3.5_

- [ ] 4.1 Implement task service (task.service.ts)
  - Create CRUD operations for tasks
  - Add filtering and ownership validation
  - Support for task linking to other entities
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 4.2 Write property tests for task service
  - **Property 15: Task Data Completeness**
  - **Property 16: Task Filtering Accuracy**
  - **Property 17: Task Ownership Validation**
  - **Property 18: Task Relationship Integrity**
  - **Property 19: Task Status Validation**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

- [ ] 4.3 Implement note service (note.service.ts)
  - Create CRUD operations for notes
  - Add ownership validation and data isolation
  - Support for bidirectional task linking
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 4.4 Write property tests for note service
  - **Property 20: Note Data Completeness**
  - **Property 21: Note CRUD Ownership**
  - **Property 22: Note-Task Bidirectional Linking**
  - **Property 23: Note Content Preservation**
  - **Property 24: Note Data Isolation**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**

- [ ] 4.5 Implement email service (email.service.ts)
  - Create email listing and management operations
  - Add filtering and ownership validation
  - Support for read/unread status updates
  - _Requirements: 2.4, 5.5_

- [ ] 4.6 Write unit tests for email service
  - Test email CRUD operations and filtering
  - Test ownership validation
  - _Requirements: 2.4, 5.5_

- [ ] 4.7 Implement calendar service (calendar.service.ts)
  - Create calendar event CRUD operations
  - Add date range filtering
  - Support for Google Calendar integration
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 4.8 Write unit tests for calendar service
  - Test calendar event operations
  - Test date range filtering
  - _Requirements: 3.1, 3.2, 3.4_

- [ ] 4.9 Implement sync service (sync.service.ts)
  - Create Gmail sync functionality
  - Implement calendar sync functionality
  - Add error resilience and progress reporting
  - _Requirements: 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 3.3, 3.5_

- [ ] 4.10 Write property tests for sync service
  - **Property 5: Gmail Sync Message Limit**
  - **Property 6: Gmail Metadata Extraction**
  - **Property 7: Email Upsert Integrity**
  - **Property 9: Sync Result Accuracy**
  - **Property 10: Calendar Date Range Filtering**
  - **Property 11: Calendar Event Data Extraction**
  - **Property 12: Calendar Event Upsert Integrity**
  - **Property 14: Sync Error Resilience**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.5, 3.1, 3.2, 3.3, 3.5**

- [ ] 5. Checkpoint - Services complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement NextAuth.js configuration
  - Set up NextAuth.js v5 with Google OAuth provider
  - Configure session handling and user creation
  - Add encrypted token storage
  - _Requirements: 1.1, 1.4, 1.5_

- [ ] 6.1 Create NextAuth configuration (auth/route.ts)
  - Configure Google OAuth provider
  - Set up session and JWT callbacks
  - Add user creation/update logic
  - _Requirements: 1.1, 1.4_

- [ ] 6.2 Write property test for user record management
  - **Property 4: User Record Management**
  - **Validates: Requirements 1.4**

- [ ] 6.3 Integrate encrypted token storage in auth callbacks
  - Store encrypted OAuth tokens during signin
  - Handle token refresh in session callback
  - _Requirements: 1.5_

- [ ] 7. Implement core API routes
  - Create health check endpoint
  - Implement task management routes
  - Build note management routes
  - _Requirements: 8.1-8.5, 4.1-4.5, 5.1-5.5_

- [ ] 7.1 Create health check endpoint (health/route.ts)
  - Implement GET /api/health with database connectivity check
  - Return standardized health response format
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 7.2 Write unit tests for health endpoint
  - Test health response format and database connectivity
  - Test unauthenticated access
  - _Requirements: 8.2, 8.3, 8.4, 8.5_

- [ ] 7.3 Implement task API routes (tasks/route.ts and tasks/[id]/route.ts)
  - Create GET, POST endpoints for task collection
  - Implement GET, PATCH, DELETE for individual tasks
  - Add request validation and error handling
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 7.4 Write property tests for task API routes
  - **Property 31: Request Validation**
  - **Property 32: Response Format Consistency**
  - **Property 27: Authentication Error Status Codes**
  - **Property 28: Validation Error Responses**
  - **Validates: Requirements 9.1, 9.2, 7.4, 7.5**

- [ ] 7.5 Implement note API routes (notes/route.ts and notes/[id]/route.ts)
  - Create GET, POST endpoints for note collection
  - Implement GET, PATCH, DELETE for individual notes
  - Add request validation and error handling
  - _Requirements: 5.1, 5.2_

- [ ] 7.6 Write unit tests for note API routes
  - Test note CRUD operations
  - Test validation and error handling
  - _Requirements: 5.1, 5.2_

- [ ] 8. Implement email and sync API routes
  - Create email management routes
  - Build Gmail sync endpoints
  - Implement calendar sync routes
  - _Requirements: 2.1-2.5, 3.1-3.5_

- [ ] 8.1 Implement email API routes (emails/route.ts and emails/[id]/route.ts)
  - Create GET endpoint for email listing with filtering
  - Implement GET, PATCH, DELETE for individual emails
  - Add ownership validation and error handling
  - _Requirements: 2.4, 5.5_

- [ ] 8.2 Write unit tests for email API routes
  - Test email listing and filtering
  - Test ownership validation
  - _Requirements: 2.4, 5.5_

- [ ] 8.3 Implement Gmail sync routes (gmail/sync/route.ts and gmail/read/route.ts)
  - Create POST /api/gmail/sync endpoint
  - Implement PATCH /api/gmail/read endpoint
  - Add sync progress reporting and error handling
  - _Requirements: 2.1, 2.4, 2.5_

- [ ] 8.4 Write property tests for Gmail sync
  - **Property 8: Email Read Status Consistency**
  - **Validates: Requirements 2.4**

- [ ] 8.5 Implement calendar API routes (calendar/sync/route.ts and calendar/create/route.ts)
  - Create POST /api/calendar/sync endpoint
  - Implement POST /api/calendar/create endpoint
  - Add date range validation and error handling
  - _Requirements: 3.1, 3.4_

- [ ] 8.6 Write property tests for calendar operations
  - **Property 13: Calendar Event Creation Consistency**
  - **Validates: Requirements 3.4**

- [ ] 9. Implement comprehensive error handling
  - Add standardized error responses across all routes
  - Implement safe error message filtering
  - Add proper HTTP status code handling
  - _Requirements: 7.1, 7.3, 7.4, 7.5, 6.4_

- [ ] 9.1 Add error handling middleware and utilities
  - Create standardized error response format
  - Implement safe error message filtering
  - Add HTTP status code mapping
  - _Requirements: 7.1, 6.4_

- [ ] 9.2 Write property tests for error handling
  - **Property 25: Safe Error Messages**
  - **Property 26: Standardized Error Responses**
  - **Validates: Requirements 6.4, 7.1, 7.3**

- [ ] 9.3 Update all API routes with comprehensive error handling
  - Apply standardized error handling to all endpoints
  - Ensure proper status codes and safe error messages
  - _Requirements: 7.1, 7.4, 7.5_

- [ ] 10. Implement data validation and serialization
  - Add request body validation across all routes
  - Implement consistent response formatting
  - Add date handling utilities
  - _Requirements: 9.1, 9.2, 9.4, 9.5_

- [ ] 10.1 Create validation schemas and utilities
  - Define Zod schemas for all request/response types
  - Implement validation middleware
  - Add date parsing and serialization utilities
  - _Requirements: 9.1, 9.4, 9.5_

- [ ] 10.2 Write property tests for data processing
  - **Property 33: Database Document Parsing**
  - **Property 34: Date Format Consistency**
  - **Property 35: Input Validation Prevention**
  - **Validates: Requirements 9.3, 9.4, 9.5**

- [ ] 10.3 Apply validation to all API routes
  - Add request validation to all endpoints
  - Ensure consistent response formatting
  - _Requirements: 9.1, 9.2_

- [ ] 11. Final integration and testing
  - Wire all components together
  - Run comprehensive test suite
  - Verify all correctness properties
  - _Requirements: All_

- [ ] 11.1 Integration testing and final wiring
  - Test end-to-end API flows
  - Verify Google API integration
  - Test authentication and authorization flows
  - _Requirements: All_

- [ ] 11.2 Run comprehensive property test suite
  - Execute all 35 correctness properties
  - Verify system-wide behavior
  - **Validates: All Requirements**

- [ ] 11.3 Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks are required for comprehensive development from the start
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- The implementation follows TypeScript strict mode throughout
- All OAuth tokens are encrypted using AES-256-GCM before storage
- Google API integration includes automatic token refresh and error resilience