import { NextResponse } from "next/server";

export interface ErrorResponse {
    error: string;
    code: string;
    details?: any;
}

/**
 * Create standardized error response
 * @param message - Human-readable error message
 * @param code - Machine-readable error code
 * @param status - HTTP status code
 * @param details - Additional error context
 * @returns NextResponse with error
 */
export function createErrorResponse(
    message: string,
    code: string,
    status: number,
    details?: any
): NextResponse<ErrorResponse> {
    const errorResponse: ErrorResponse = {
        error: message,
        code,
        ...(details && { details })
    };

    return NextResponse.json(errorResponse, { status });
}

/**
 * Handle authentication errors
 * @param error - Error object
 * @returns NextResponse with appropriate auth error
 */
export function handleAuthError(error: Error): NextResponse<ErrorResponse> {
    if (error.message === "Authentication required") {
        return createErrorResponse(
            "Authentication required",
            "AUTH_REQUIRED",
            401
        );
    }
    
    if (error.message === "Access denied") {
        return createErrorResponse(
            "Access denied",
            "ACCESS_DENIED",
            403
        );
    }

    return createErrorResponse(
        "Authentication failed",
        "AUTH_FAILED",
        401
    );
}

/**
 * Handle database errors
 * @param error - Error object
 * @returns NextResponse with safe database error
 */
export function handleDatabaseError(error: any): NextResponse<ErrorResponse> {
    console.error("Database error:", error);

    if (error.code === 11000) {
        return createErrorResponse(
            "Data conflict",
            "CONSTRAINT_VIOLATION",
            409
        );
    }

    return createErrorResponse(
        "Service temporarily unavailable",
        "DATABASE_ERROR",
        500
    );
}

/**
 * Handle validation errors
 * @param error - Validation error
 * @returns NextResponse with validation error details
 */
export function handleValidationError(error: any): NextResponse<ErrorResponse> {
    return createErrorResponse(
        "Validation failed",
        "VALIDATION_ERROR",
        400,
        {
            field: error.path,
            message: error.message
        }
    );
}

/**
 * Handle Google API errors
 * @param error - Google API error
 * @returns NextResponse with appropriate error
 */
export function handleGoogleAPIError(error: any): NextResponse<ErrorResponse> {
    console.error("Google API error:", error);

    if (error.code === 429) {
        return createErrorResponse(
            "Service temporarily unavailable",
            "RATE_LIMITED",
            429
        );
    }

    if (error.code === 401 || error.code === 403) {
        return createErrorResponse(
            "Unable to refresh authentication",
            "TOKEN_REFRESH_FAILED",
            401
        );
    }

    return createErrorResponse(
        "External service error",
        "EXTERNAL_SERVICE_ERROR",
        502
    );
}

/**
 * Handle generic errors safely
 * @param error - Any error
 * @returns NextResponse with safe error message
 */
export function handleGenericError(error: any): NextResponse<ErrorResponse> {
    console.error("Unexpected error:", error);

    return createErrorResponse(
        "Internal server error",
        "INTERNAL_ERROR",
        500
    );
}