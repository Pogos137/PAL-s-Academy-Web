// Lucide icon helper — pulls from window.lucide
function Icon({ name, size = 20, strokeWidth = 2, style = {}, className = "" }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current && window.lucide) {
      ref.current.innerHTML = "";
      const el = document.createElement("i");
      el.setAttribute("data-lucide", name);
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.display = "inline-flex";
      ref.current.appendChild(el);
      window.lucide.createIcons({
        attrs: { "stroke-width": strokeWidth },
        nameAttr: "data-lucide",
      });
    }
  }, [name, size, strokeWidth]);
  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-flex", lineHeight: 0, ...style }}
    />
  );
}

window.Icon = Icon;

// Facebook brand icon (lucide dropped this — inline SVG fallback)
function FacebookIcon({ size = 16, style = {} }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      style={{ display: "inline-flex", verticalAlign: "middle", ...style }}
      aria-hidden="true"
    >
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.19 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.91h-2.33V22c4.78-.75 8.44-4.92 8.44-9.94z" />
    </svg>
  );
}
window.FacebookIcon = FacebookIcon;
