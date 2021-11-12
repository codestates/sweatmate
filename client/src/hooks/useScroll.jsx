import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

export function useScroll() {
  const [scrollY, setScrollY] = useState(0);
  const listener = debounce(() => {
    setScrollY(window.pageYOffset);
  }, 15);

  useEffect(() => {
    window.addEventListener("scroll", listener);
    return () => window.removeEventListener("scroll", listener);
  });

  return {
    scrollY,
  };
}
