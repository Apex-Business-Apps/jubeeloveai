/**
 * Centralized Position Management for Jubee
 * 
 * Single source of truth for all position validation and boundary calculations.
 * Eliminates conflicts between multiple hooks managing position independently.
 */

interface ContainerPosition {
  bottom: number;
  right: number;
}

interface ViewportBounds {
  width: number;
  height: number;
}

interface ContainerDimensions {
  width: number;
  height: number;
}

// Unified safe margin for consistent boundary enforcement
export const JUBEE_SAFE_MARGIN = 20;
export const JUBEE_CONTAINER_WIDTH = 400;
export const JUBEE_CONTAINER_HEIGHT = 450;

/**
 * Get current viewport dimensions
 */
export function getViewportBounds(): ViewportBounds {
  return {
    width: window.innerWidth,
    height: window.innerHeight
  };
}

/**
 * Get Jubee container dimensions
 */
export function getContainerDimensions(): ContainerDimensions {
  return {
    width: JUBEE_CONTAINER_WIDTH,
    height: JUBEE_CONTAINER_HEIGHT
  };
}

/**
 * Calculate maximum safe boundaries to keep Jubee fully visible
 */
export function calculateMaxBoundaries(): { maxBottom: number; maxRight: number; minBottom: number; minRight: number } {
  const viewport = getViewportBounds();
  const container = getContainerDimensions();
  
  return {
    minBottom: JUBEE_SAFE_MARGIN,
    minRight: JUBEE_SAFE_MARGIN,
    maxBottom: viewport.height - container.height - JUBEE_SAFE_MARGIN,
    maxRight: viewport.width - container.width - JUBEE_SAFE_MARGIN
  };
}

/**
 * Validate and clamp position to ensure Jubee stays fully within viewport
 */
export function validatePosition(position: ContainerPosition): ContainerPosition {
  const { minBottom, minRight, maxBottom, maxRight } = calculateMaxBoundaries();
  
  // Guard against NaN and Infinity
  const safeBottom = Number.isFinite(position.bottom) ? position.bottom : 120;
  const safeRight = Number.isFinite(position.right) ? position.right : 100;
  
  // Clamp to valid range
  return {
    bottom: Math.max(minBottom, Math.min(maxBottom, safeBottom)),
    right: Math.max(minRight, Math.min(maxRight, safeRight))
  };
}

/**
 * Get a safe default position (bottom-right corner with margin)
 */
export function getSafeDefaultPosition(): ContainerPosition {
  const viewport = getViewportBounds();
  const container = getContainerDimensions();
  
  // Position in bottom-right with comfortable margin
  const defaultBottom = Math.max(120, JUBEE_SAFE_MARGIN);
  const defaultRight = Math.max(100, JUBEE_SAFE_MARGIN);
  
  // Ensure it fits within viewport
  return validatePosition({
    bottom: defaultBottom,
    right: defaultRight
  });
}

/**
 * Check if a position is fully visible within the viewport
 */
export function isPositionVisible(position: ContainerPosition): boolean {
  const { minBottom, minRight, maxBottom, maxRight } = calculateMaxBoundaries();
  
  return (
    position.bottom >= minBottom &&
    position.bottom <= maxBottom &&
    position.right >= minRight &&
    position.right <= maxRight
  );
}

/**
 * Find the nearest valid position if current position is invalid
 */
export function findNearestValidPosition(position: ContainerPosition): ContainerPosition {
  // If already valid, return as-is
  if (isPositionVisible(position)) {
    return position;
  }
  
  // Otherwise, clamp to valid bounds
  return validatePosition(position);
}

/**
 * Calculate distance between two positions
 */
export function calculateDistance(pos1: ContainerPosition, pos2: ContainerPosition): number {
  const dx = pos1.right - pos2.right;
  const dy = pos1.bottom - pos2.bottom;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Get preferred safe positions across the viewport
 * Returns an array of positions that are guaranteed to be fully visible
 */
export function getPreferredPositions(): ContainerPosition[] {
  const viewport = getViewportBounds();
  const container = getContainerDimensions();
  const margin = JUBEE_SAFE_MARGIN + 50; // Extra margin for comfort
  
  const positions: ContainerPosition[] = [];
  
  // Bottom-right (default)
  positions.push(validatePosition({ bottom: 120, right: 100 }));
  
  // Bottom-left
  positions.push(validatePosition({ 
    bottom: 120, 
    right: viewport.width - container.width - margin 
  }));
  
  // Top-right
  positions.push(validatePosition({ 
    bottom: viewport.height - container.height - margin, 
    right: 100 
  }));
  
  // Top-left
  positions.push(validatePosition({ 
    bottom: viewport.height - container.height - margin, 
    right: viewport.width - container.width - margin 
  }));
  
  // Center-right
  positions.push(validatePosition({ 
    bottom: (viewport.height - container.height) / 2, 
    right: 100 
  }));
  
  return positions;
}
