import React, { useEffect, useRef, forwardRef, CSSProperties } from 'react';

export interface PaperTunnelProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Color 1: Top paper sheet highlight tint.
   * @default "#f4e1c1"
   */
  color1?: string;

  /**
   * Color 2: Intermediate paper sheet mid-tone.
   * @default "#787364"
   */
  color2?: string;

  /**
   * Color 3: Deepest tunnel center glow tint.
   * @default "#5a564e"
   */
  color3?: string;

  /**
   * Speed multiplier for paper sway animation (0.2x to 3x).
   * @default 3
   */
  speed?: number;

  /**
   * Density / scale multiplier for paper tunnel sizing (0.5x to 2x).
   * @default 2
   */
  density?: number;

  /**
   * Opacity of the paper tunnel layers (0.2 to 1).
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
   * Blend mode for canvas layers.
   * @default "screen"
   */
  blend?: string;

  /**
   * Minimum height of the tunnel container.
   * @default "100%"
   */
  minHeight?: string | number;

  /**
   * Whether this component acts purely as a decorative background.
   * When true, applies role="presentation" and aria-hidden="true".
   * @default false
   */
  asBackground?: boolean;

  /**
   * Interactive pointer parallax depth tracking.
   * @default true
   */
  interactiveParallax?: boolean;

  /**
   * Optional child elements to render over the paper cut backdrop.
   */
  children?: React.ReactNode;

  /**
   * Custom CSS class names.
   */
  className?: string;
}

// The 9 paper cutout paths from AIMRAN Library
const TUNNEL_LAYERS = [
  {
    i: 0,
    r: -1,
    d: "M-2000-2000H3000V3000H-2000ZM571.8 500.0L573.6 505.1L574.0 510.4L573.1 515.5L571.1 520.4L568.7 525.0L566.2 529.5L563.9 534.0L561.7 538.6L559.3 543.1L556.2 547.2L552.3 550.5L547.6 552.9L542.3 554.2L537.0 554.8L532.0 555.4L527.5 556.5L523.6 558.4L519.9 561.1L516.1 564.4L511.9 567.6L507.4 570.1L502.5 571.5L497.5 571.7L492.5 571.2L487.6 570.3L482.7 569.5L477.6 569.0L472.3 568.5L467.0 567.6L462.0 565.8L457.6 562.9L454.2 558.7L451.8 553.6L450.2 548.1L449.0 542.8L447.7 538.0L445.8 533.9L443.2 530.2L440.1 526.7L437.1 522.9L434.6 518.8L433.0 514.2L432.2 509.5L431.9 504.8L431.7 500.0L431.2 495.2L430.2 490.2L429.0 484.9L428.1 479.4L428.0 473.8L429.4 468.6L432.3 464.0L436.5 460.3L441.4 457.4L446.5 455.1L451.2 452.8L455.3 450.4L459.0 447.5L462.5 444.4L466.2 441.5L470.3 439.2L474.8 437.6L479.5 436.8L484.2 436.4L488.7 435.9L493.1 434.8L497.7 432.9L502.4 430.4L507.6 428.0L513.0 426.2L518.5 425.8L523.7 426.9L528.5 429.6L532.6 433.2L536.2 437.2L539.7 441.2L543.2 444.7L546.8 448.0L550.4 451.3L553.7 455.0L556.3 459.1L557.9 463.8L558.7 468.8L559.1 473.7L559.6 478.3L560.7 482.6L562.8 486.7L565.7 490.8L568.9 495.2Z"
  },
  {
    i: 1,
    r: 1,
    d: "M-2000-2000H3000V3000H-2000ZM630.4 500.0L631.1 509.2L627.4 517.9L619.6 525.4L610.8 531.8L604.2 537.9L601.3 545.1L601.1 553.8L600.8 563.0L598.3 571.4L593.4 578.4L587.6 584.6L582.6 591.7L578.4 600.3L573.7 609.2L566.9 615.9L557.6 618.1L546.9 616.1L536.5 612.4L527.5 610.1L519.6 611.2L512.0 614.5L504.1 617.6L495.9 618.5L487.7 617.3L479.5 616.1L470.9 616.8L461.2 619.5L450.7 622.0L441.0 621.1L433.4 615.3L428.6 605.9L425.3 595.6L421.7 587.0L416.5 580.6L410.3 575.3L404.6 569.3L401.0 561.9L398.7 553.9L395.7 546.4L390.0 540.0L381.6 533.9L372.9 527.0L367.3 518.7L366.8 509.3L370.8 500.0L376.3 491.3L380.4 483.2L382.6 475.1L384.4 466.8L387.8 459.2L393.7 452.7L400.5 447.1L405.7 441.1L407.9 433.1L407.9 422.7L408.4 411.5L411.7 401.9L418.6 395.8L427.7 392.8L437.1 391.0L445.6 388.5L453.5 384.9L461.6 381.9L470.5 381.6L479.6 384.4L488.3 388.4L496.2 390.5L503.9 388.5L512.3 383.2L521.6 377.6L531.2 375.0L540.1 376.7L548.0 381.3L555.4 386.4L563.2 390.5L571.4 394.1L578.8 399.1L583.8 406.9L585.9 417.0L586.6 427.3L588.5 435.7L593.7 441.5L601.9 445.8L610.8 450.7L617.6 457.2L621.2 465.3L622.7 473.9L624.3 482.5L627.3 491.1Z"
  },
  {
    i: 2,
    r: -1,
    d: "M-2000-2000H3000V3000H-2000ZM671.6 500.0L667.4 511.7L661.6 522.7L655.7 533.1L650.9 543.3L648.3 554.0L647.8 565.8L648.3 578.9L648.4 592.7L646.5 606.4L641.7 618.9L633.9 629.3L623.9 637.6L612.6 644.1L601.1 649.9L589.9 655.7L579.0 661.9L568.0 668.2L556.4 673.5L544.0 676.5L531.1 676.5L518.2 673.3L505.9 667.8L494.4 661.6L483.6 656.5L472.9 653.5L461.9 652.9L449.9 654.1L437.2 655.4L424.2 655.4L411.7 653.0L400.3 647.9L390.2 640.6L381.0 632.1L372.2 623.4L362.9 615.0L353.1 606.8L343.1 598.1L334.0 588.2L327.4 576.9L324.1 564.0L324.5 550.3L327.9 536.6L332.8 523.5L337.5 511.4L340.5 500.0L341.3 488.9L340.4 477.6L339.1 465.8L338.7 453.7L340.3 441.9L344.2 430.6L349.8 420.1L356.2 410.1L362.2 399.9L367.5 388.8L372.4 376.7L377.5 364.0L384.1 351.6L392.9 341.2L404.1 333.9L417.2 330.2L431.3 329.8L445.3 331.6L458.6 333.9L471.0 335.4L482.7 335.4L494.2 334.3L505.8 333.0L517.6 332.8L529.2 334.6L540.3 338.6L550.7 343.9L560.8 349.6L571.1 354.3L582.3 357.4L594.9 359.4L608.5 361.1L622.5 363.9L635.5 369.1L646.3 377.2L654.0 388.1L658.7 400.8L661.2 414.3L662.8 427.5L664.6 440.1L667.1 452.1L670.0 463.9L672.5 475.8L673.2 487.9Z"
  },
  {
    i: 3,
    r: 1,
    d: "M-2000-2000H3000V3000H-2000ZM721.7 500.0L722.1 515.5L726.2 531.8L732.9 549.5L737.1 568.0L733.8 585.1L721.3 598.5L703.1 608.0L685.1 615.7L671.7 624.8L662.9 636.7L655.5 650.2L646.0 662.2L633.5 670.9L620.0 677.8L607.8 686.8L597.8 700.5L588.0 717.8L575.9 733.6L560.4 742.2L542.5 741.1L524.5 733.2L507.8 724.3L492.3 719.1L477.1 717.8L461.8 716.7L447.1 712.1L434.0 703.3L421.7 693.8L408.3 688.1L391.4 688.0L371.4 690.7L351.0 690.8L334.4 683.9L324.0 670.0L318.5 652.3L314.2 635.0L308.0 620.0L300.0 606.3L293.6 591.9L292.0 575.7L295.1 558.8L298.7 542.8L297.4 528.5L288.7 514.8L275.4 500.0L263.9 483.5L259.5 466.2L263.5 449.7L272.3 434.7L281.1 420.3L287.4 405.4L293.4 390.1L302.5 376.6L317.1 367.1L335.1 361.6L352.2 357.3L364.5 349.6L371.8 336.0L377.2 318.0L384.7 300.3L396.4 287.6L411.5 280.8L427.6 277.3L443.4 273.0L458.8 266.6L474.9 260.8L491.6 260.5L508.1 268.2L522.9 281.8L536.1 295.3L549.1 302.9L563.9 303.2L580.9 299.7L598.5 298.0L614.6 301.6L628.2 309.9L641.1 319.4L655.5 327.4L671.8 334.1L687.6 342.6L698.5 355.8L701.6 374.0L698.4 394.5L694.1 413.6L694.1 429.4L700.4 442.5L710.1 455.3L718.3 469.3L721.7 484.5Z"
  },
  {
    i: 4,
    r: -1,
    d: "M-2000-2000H3000V3000H-2000ZM767.8 500.0L771.1 519.0L776.4 538.9L782.4 560.0L786.7 582.2L786.6 604.3L780.6 624.9L768.5 642.8L751.7 657.3L732.4 668.9L713.1 678.8L695.4 688.7L679.6 699.5L665.2 711.5L650.8 723.6L635.2 734.3L618.1 742.1L599.6 746.6L580.7 748.5L562.2 749.5L544.4 751.9L527.0 757.2L509.3 765.8L490.4 776.3L469.9 786.2L448.4 792.7L426.8 793.7L406.3 788.4L387.8 777.8L371.3 763.9L356.3 749.0L341.7 734.8L326.8 721.7L311.5 709.3L296.9 696.1L284.4 680.9L275.2 663.4L269.8 643.8L267.7 623.5L266.8 603.8L264.8 585.6L259.7 568.9L250.7 553.0L238.8 536.7L226.2 519.1L215.7 500.0L209.6 479.7L208.8 459.1L213.0 439.0L220.4 419.8L228.9 401.3L237.1 383.0L244.6 364.2L252.2 345.2L261.6 326.8L274.2 310.5L290.7 297.8L310.4 289.4L331.9 284.9L353.3 282.5L373.0 280.1L390.4 275.3L405.9 267.1L420.7 255.9L436.0 243.3L452.7 231.8L470.9 223.5L490.2 219.4L509.8 219.1L529.3 221.1L548.7 223.6L568.5 225.2L589.1 225.7L610.5 226.5L631.9 229.5L652.0 236.7L669.2 249.2L682.4 266.5L691.6 287.3L697.8 309.0L703.0 329.7L709.1 348.1L717.6 364.1L728.2 378.7L739.9 393.2L750.8 408.7L759.0 425.7L763.8 443.9L765.8 462.7L766.4 481.4Z"
  },
  {
    i: 5,
    r: 1,
    d: "M-2000-2000H3000V3000H-2000ZM797.1 500.0L799.0 520.9L807.7 543.2L819.4 567.9L828.1 594.1L829.2 619.8L821.5 643.1L807.4 663.5L791.2 681.9L776.0 700.5L762.4 720.2L748.5 740.0L731.4 757.0L709.5 768.1L683.6 772.2L656.7 771.4L631.9 770.3L610.7 774.0L592.6 784.8L575.2 801.5L556.3 819.3L535.0 833.0L511.9 839.6L488.1 839.7L464.6 836.5L441.1 834.0L416.8 833.6L391.6 833.7L366.6 830.2L344.3 819.3L326.9 799.9L314.8 774.5L306.2 748.0L297.3 725.2L284.6 708.0L267.2 695.3L246.8 683.9L227.2 670.4L211.7 653.3L201.1 633.1L193.1 611.7L184.4 590.5L172.2 569.7L157.4 548.1L144.0 524.9L137.1 500.0L140.6 474.9L154.1 451.4L173.8 430.7L193.6 412.1L209.0 394.1L218.5 374.7L224.7 353.6L231.5 332.2L242.0 312.6L256.8 296.0L273.8 281.5L289.8 266.5L303.1 248.0L314.5 225.0L326.7 199.8L342.5 177.1L363.5 162.1L388.6 157.1L415.5 161.1L441.7 169.3L466.0 176.6L488.8 180.0L511.2 180.1L533.6 180.1L555.7 184.0L576.5 193.2L595.5 206.0L613.8 218.3L633.6 226.1L656.9 228.3L683.9 227.3L712.5 228.0L738.9 234.7L759.4 249.5L772.8 271.1L780.8 296.0L786.9 320.7L794.5 343.4L804.0 364.7L813.3 386.0L818.8 408.6L817.8 432.5L811.0 456.3L802.3 478.9Z"
  },
  {
    i: 6,
    r: -1,
    d: "M-2000-2000H3000V3000H-2000ZM888.8 500.0L883.5 526.8L872.1 552.3L856.2 575.7L839.0 597.2L823.8 617.9L813.1 639.4L807.2 663.3L804.5 690.3L802.1 719.5L796.6 748.9L785.8 776.0L769.1 798.9L747.6 816.9L723.3 831.0L698.1 843.1L673.3 855.2L648.8 868.4L624.1 882.0L598.1 893.6L570.6 900.6L542.1 900.4L513.7 892.6L486.8 878.7L462.0 861.9L439.0 846.1L416.6 834.3L393.5 827.8L368.5 825.5L341.7 824.6L314.2 821.8L287.7 814.8L263.6 802.5L242.6 785.8L223.9 766.6L205.9 746.8L186.7 727.6L165.7 708.9L143.7 689.5L123.1 667.8L107.2 643.0L98.7 615.1L98.9 585.3L106.7 555.3L119.2 526.6L132.5 500.0L143.2 475.0L149.7 450.8L152.4 426.1L153.5 400.7L156.1 374.8L162.5 349.7L173.4 326.4L188.0 305.1L204.2 285.1L219.7 264.8L233.4 242.6L245.6 217.4L257.8 190.0L272.4 162.6L291.3 138.4L315.0 120.7L342.9 111.2L373.2 109.7L403.7 113.9L433.1 120.4L460.7 126.1L487.1 129.3L512.9 130.1L538.9 130.4L564.7 132.9L589.8 139.7L613.3 151.3L634.8 166.4L654.9 182.4L675.2 196.6L697.4 207.4L722.9 214.8L751.5 220.7L781.6 228.0L810.5 239.5L834.9 256.7L852.9 279.5L864.1 306.4L869.8 335.3L872.8 364.3L875.6 392.3L879.7 419.3L884.6 445.9L888.6 472.8Z"
  },
  {
    i: 7,
    r: 1,
    d: "M-2000-2000H3000V3000H-2000ZM925.6 500.0L923.7 529.6L919.8 559.0L918.7 589.0L922.5 621.2L928.5 655.9L930.6 691.7L922.7 724.8L902.3 751.4L871.5 769.9L836.3 782.2L803.0 792.6L775.1 805.6L752.4 823.1L731.6 843.4L709.1 862.3L683.3 875.8L654.9 883.4L626.3 888.6L598.9 896.6L572.6 911.6L545.5 933.1L515.9 955.9L483.5 972.2L450.0 975.8L417.9 965.4L389.1 944.7L363.3 920.7L338.6 899.4L313.2 883.1L286.6 869.5L261.0 854.3L239.2 833.8L222.7 808.0L209.9 780.1L196.7 754.5L177.9 734.0L151.1 718.0L118.5 702.8L86.0 684.3L60.7 659.9L47.1 629.9L45.1 596.7L49.7 563.3L55.1 531.1L57.6 500.0L57.8 469.1L60.3 438.2L69.7 408.5L88.1 381.9L112.8 359.1L137.6 338.6L156.3 317.3L166.2 291.4L169.3 259.7L171.4 224.3L178.6 189.6L194.3 160.5L218.1 139.1L246.3 123.8L275.2 110.5L302.8 95.6L329.8 78.6L358.0 63.0L388.9 54.4L421.9 56.8L454.8 69.8L485.6 88.4L513.8 104.7L540.7 112.6L568.7 110.6L599.1 102.5L631.6 95.1L663.8 94.6L693.7 102.9L720.6 117.8L746.4 134.7L773.6 149.8L803.5 163.0L834.3 177.1L861.6 196.6L880.1 223.8L887.3 258.0L884.9 295.4L878.9 331.3L876.3 363.0L881.5 390.6L894.1 416.2L909.3 442.5L921.0 470.6Z"
  },
  {
    i: 8,
    r: -1,
    d: "M-2000-2000H3000V3000H-2000ZM1006.6 500.0L1002.0 535.1L998.3 570.0L995.8 605.4L992.8 641.3L986.1 676.9L972.5 710.4L950.4 739.5L920.6 762.8L886.2 780.6L851.3 794.8L819.5 808.6L792.9 825.3L770.9 846.7L751.4 872.8L731.5 900.9L708.5 927.5L681.6 949.4L651.0 964.7L618.2 974.2L584.7 980.3L551.1 986.1L517.3 994.0L482.4 1004.0L446.0 1013.8L408.4 1019.4L371.1 1016.9L336.3 1003.8L305.8 980.6L280.5 950.0L259.5 916.5L240.5 884.7L220.9 857.2L198.7 834.7L173.6 815.2L147.2 796.1L122.1 774.5L101.1 749.3L85.1 720.6L73.5 689.9L63.6 658.9L52.0 628.5L36.6 598.5L17.2 567.8L-3.7 535.2L-21.7 500.0L-32.1 462.8L-31.6 425.3L-19.6 389.6L1.7 357.1L28.1 328.2L55.1 301.9L79.4 276.3L100.0 250.1L118.4 222.8L137.1 195.5L158.8 170.5L184.6 149.7L214.1 134.1L245.4 122.5L276.1 112.2L304.7 99.6L331.1 81.8L356.5 58.4L383.2 31.4L412.7 4.9L445.8 -16.1L481.6 -27.7L518.5 -28.3L554.6 -19.5L589.0 -4.5L621.6 12.4L653.3 28.2L685.1 42.0L717.0 55.1L748.1 70.4L776.3 90.3L799.8 116.2L817.6 147.3L830.5 180.8L841.3 213.7L853.5 243.2L870.4 268.6L893.4 290.8L921.3 312.4L950.6 336.0L977.0 363.2L996.3 394.5L1006.9 428.8L1009.3 464.4Z"
  }
];

/**
 * Layered Paper Cut Tunnel (AIMRAN Library Background)
 *
 * Nine sheets of paper with wavy holes turn slowly and spread apart in depth
 * as the pointer moves across them.
 */
export const PaperTunnel = forwardRef<HTMLDivElement, PaperTunnelProps>(
  (
    {
      color1 = '#f4e1c1',
      color2 = '#787364',
      color3 = '#5a564e',
      speed = 3,
      density = 2,
      opacity = 1,
      bgColor = '#05060a',
      fgColor = '#ffffff',
      blend = 'screen',
      minHeight,
      asBackground = false,
      interactiveParallax = true,
      children,
      className = '',
      style,
      ...rest
    },
    forwardedRef
  ) => {
    const internalRef = useRef<HTMLDivElement | null>(null);

    // Merge forwarded ref and internal ref
    const setRef = (node: HTMLDivElement | null) => {
      internalRef.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    };

    // Pointer-move depth parallax effect
    useEffect(() => {
      const el = internalRef.current;
      if (!el || !interactiveParallax) return;

      const handlePointerMove = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const mx = ((e.clientX - r.left) / r.width - 0.5).toFixed(3);
        const my = ((e.clientY - r.top) / r.height - 0.5).toFixed(3);
        el.style.setProperty('--mx', mx);
        el.style.setProperty('--my', my);
        el.dataset.on = '1';
      };

      const handlePointerLeave = () => {
        el.style.setProperty('--mx', '0');
        el.style.setProperty('--my', '0');
        delete el.dataset.on;
      };

      // Add to window if asBackground so moving pointer anywhere in viewport shifts the tunnel layers
      const target = asBackground ? window : el;
      target.addEventListener('pointermove', handlePointerMove as EventListener, { passive: true });
      el.addEventListener('pointerleave', handlePointerLeave);

      return () => {
        target.removeEventListener('pointermove', handlePointerMove as EventListener);
        el.removeEventListener('pointerleave', handlePointerLeave);
      };
    }, [asBackground, interactiveParallax]);

    // Bounds checking
    const clampedSpeed = Math.max(0.2, Math.min(3, speed));
    const clampedDensity = Math.max(0.5, Math.min(2, density));
    const clampedOpacity = Math.max(0.2, Math.min(1, opacity));

    const tunnelStyle: React.CSSProperties & Record<string, string | number> = {
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
        ref={setRef}
        className={`pt-uvq16-paper-tunnel ${className}`}
        style={tunnelStyle}
        role={asBackground ? 'presentation' : rest.role}
        aria-hidden={asBackground ? true : rest['aria-hidden']}
        {...rest}
      >
        {/* Layer stack */}
        <div className="st pointer-events-none" aria-hidden="true">
          {TUNNEL_LAYERS.map((layer) => (
            <svg
              key={layer.i}
              className="ly"
              style={{ '--i': layer.i.toString(), '--r': layer.r.toString() } as CSSProperties}
              viewBox="0 0 1000 1000"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
            >
              <path fillRule="evenodd" d={layer.d} />
            </svg>
          ))}
        </div>

        {/* Paper texture noise overlay */}
        <i className="nz pointer-events-none" aria-hidden="true" />

        {/* Content layer */}
        {children && (
          <div className="relative z-10 w-full h-full">
            {children}
          </div>
        )}
      </div>
    );
  }
);

PaperTunnel.displayName = 'PaperTunnel';

/**
 * PatternUvq16PaperTunnel alias matching AIMRAN Library reference naming.
 */
export const PatternUvq16PaperTunnel = PaperTunnel;

export default PaperTunnel;
