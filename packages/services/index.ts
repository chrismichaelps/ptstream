/**
 * Services Package
 * 
 * A collection of reusable services and utilities for the Effect Store system.
 * This package provides middleware, utilities, and tools for building robust
 * state management solutions.
 */

// Logger middleware
export * from './logger';

// Core Services
export * from './storage';
export * from './app-state';
export * from './search-state';
export * from './input-search';
export * from './season';
export * from './language';

// HTTP and API Services
export { default as HttpClientService } from './http-client';
export { default as MovieService } from './movie';
export { default as PromoService } from './promo';
export { default as SerieService } from './serie';
export { default as SearchService } from './search';
