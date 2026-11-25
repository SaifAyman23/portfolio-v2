export function TextStrokeFilters() {
  return (
    <svg
      width="0"
      height="0"
      className="pointer-events-none absolute h-0 w-0 overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        {/* Hollow outer stroke: 3px (erases glyph interior, leaving true outer boundary) */}
        <filter
          id="outer-stroke-3"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          color-interpolation-filters="sRGB"
        >
          <feMorphology in="SourceGraphic" operator="dilate" radius="3" result="thickened" />
          <feComposite in="thickened" in2="SourceAlpha" operator="out" />
        </filter>

        {/* Hollow outer stroke: 2px */}
        <filter
          id="outer-stroke-2"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          color-interpolation-filters="sRGB"
        >
          <feMorphology in="SourceGraphic" operator="dilate" radius="2" result="thickened" />
          <feComposite in="thickened" in2="SourceAlpha" operator="out" />
        </filter>

        {/* Filled text with outer stroke: 3px (outer stroke painted behind glyph fill, always in --foreground) */}
        <filter id="outer-stroke-fill-3" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="thickened" />
          <feFlood style={{ floodColor: 'var(--foreground)' }} result="strokeColor" />
          <feComposite in="strokeColor" in2="thickened" operator="in" result="stroke" />
          <feMerge>
            <feMergeNode in="stroke" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Filled text with outer stroke: 2px */}
        <filter id="outer-stroke-fill-2" x="-20%" y="-20%" width="140%" height="140%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="2" result="thickened" />
          <feFlood style={{ floodColor: 'var(--foreground)' }} result="strokeColor" />
          <feComposite in="strokeColor" in2="thickened" operator="in" result="stroke" />
          <feMerge>
            <feMergeNode in="stroke" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  )
}
