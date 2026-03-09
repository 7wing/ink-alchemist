const CandleOverlay = () => (
  <div
    className="pointer-events-none fixed inset-0 z-50 animate-candle-flicker"
    style={{
      background: "radial-gradient(ellipse at 50% 20%, hsl(40 100% 50% / 0.06) 0%, transparent 50%)",
    }}
    aria-hidden="true"
  />
);

export default CandleOverlay;
