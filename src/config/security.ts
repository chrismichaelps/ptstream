/**
 * Security Configuration
 * 
 * This file handles external URL navigation and popup blocking with a scalable
 * domain allowlist system. 
 * 
 */

// Security actions
export const SECURITY_ACTIONS = {
  ALLOW: 'allow',
  DENY: 'deny'
} as const;

// Allowed external domains configuration
export const ALLOWED_DOMAINS_CONFIG = {
  GITHUB: ['github.com', 'www.github.com'],
} as const;

// Helper function to check if URL is allowed
export const isAllowedDomain = (hostname: string): boolean => {
  const allAllowedDomains = Object.values(ALLOWED_DOMAINS_CONFIG).flat() as string[];
  return allAllowedDomains.includes(hostname);
};

// Helper function to get allowed domains for logging
export const getAllowedDomains = (): string[] => {
  return Object.values(ALLOWED_DOMAINS_CONFIG).flat();
};

// Utility function to add new domains (for future use)
export const addAllowedDomain = (category: string, domains: string[]): void => {
  console.log(`Adding new allowed domains for ${category}:`, domains);
  // This would be used in a more dynamic system
  // For now, domains are added statically to ALLOWED_DOMAINS_CONFIG
};

// Helper function to validate domain format
export const isValidDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
};
