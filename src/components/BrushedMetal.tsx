import React, { forwardRef, useId } from 'react';

export interface BrushedMetalProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Base metallic shadow tint.
   * @default "#9aa4b2"
   */
  color1?: string;

  /**
   * Highlight specular mid-tone.
   * @default "#d7dde5"
   */
  color2?: string;

  /**
   * Streak of light tint.
   * @default "#8ec5ff"
   */
  color3?: string;

  /**
   * Speed multiplier (from 0.2x to 3x).
   * @default 1
   */
  speed?: number;

  /**
   * Density / grain scale multiplier (from 0.5x to 2x).
   * @default 1
   */
  density?: number;

  /**
   * Opacity of the metallic texture and streak (from 0.2 to 1).
   * @default 1
   */
  opacity?: number;

  /**
   * Base background fallback color.
   * @default "#05060a"
   */
  bgColor?: string;

  /**
   * Foreground text color.
   * @default "#ffffff"
   */
  fgColor?: string;

  /**
   * Blend mode for light streak overlay.
   * @default "screen"
   */
  blend?: string;

  /**
   * Minimum height of the metal container.
   * @default "100%"
   */
  minHeight?: string | number;

  /**
   * Whether this component acts purely as a decorative background.
   * When true, applies role="presentation" and aria-hidden="true" to the wrapper.
   * @default false
   */
  asBackground?: boolean;

  /**
   * Optional child elements to render over the brushed metal surface.
   */
  children?: React.ReactNode;

  /**
   * Custom CSS class names.
   */
  className?: string;
}

/**
 * BrushedMetal (AIMRAN Library Background)
 *
 * A brushed aluminum texture with a streak of light that slides across it every few seconds.
 * Built with pure HTML/CSS keyframe animation and CSS variables for high-performance rendering.
 */
export const BrushedMetal = forwardRef<HTMLDivElement, BrushedMetalProps>(
  (
    {
      color1 = '#9aa4b2',
      color2 = '#d7dde5',
      color3 = '#8ec5ff',
      speed = 1,
      density = 1,
      opacity = 1,
      bgColor = '#05060a',
      fgColor = '#ffffff',
      blend = 'screen',
      minHeight,
      asBackground = false,
      children,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    // Clamp values within specified ranges
    const clampedSpeed = Math.max(0.2, Math.min(3, speed));
    const clampedDensity = Math.max(0.5, Math.min(2, density));
    const clampedOpacity = Math.max(0.2, Math.min(1, opacity));

    // Construct inline CSS custom properties
    const metalStyle: React.CSSProperties & Record<string, string | number> = {
      '--c1': color1,
      '--c2': color2,
      '--c3': color3,
      '--k': clampedSpeed,
      '--d': clampedDensity,
      '--o': clampedOpacity,
      '--bg': bgColor,
      '--fg': fgColor,
      '--blend': blend,
      ...(minHeight ? { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight } : {}),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={`pt-metal ${className}`}
        style={metalStyle}
        role={asBackground ? 'presentation' : rest.role}
        aria-hidden={asBackground ? true : rest['aria-hidden']}
        {...rest}
      >
        {/* Brushed aluminum texture layer */}
        <i aria-hidden="true" />
        {/* Sweeping streak of specular light */}
        <b aria-hidden="true" />
        {/* Child content rendered with elevated z-index */}
        {children && (
          <div className="relative z-10 w-full h-full">
            {children}
          </div>
        )}
      </div>
    );
  }
);

BrushedMetal.displayName = 'BrushedMetal';

/**
 * PatternMetal alias matching AIMRAN Library reference naming.
 */
export const PatternMetal = BrushedMetal;

export default BrushedMetal;
