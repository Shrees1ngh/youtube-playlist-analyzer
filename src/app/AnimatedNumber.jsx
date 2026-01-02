import { useEffect, useState } from "react";

export default function AnimatedNumber({
  value,
  duration = 800,
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value);
    if (start === end) return;

    const increment = end / (duration / 16);
    let raf;

    function animate() {
      start += increment;
      if (start < end) {
        setDisplay(Math.floor(start));
        raf = requestAnimationFrame(animate);
      } else {
        setDisplay(end);
      }
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display}</>;
}
