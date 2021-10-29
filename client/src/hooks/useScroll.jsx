import { useState, useEffect } from "react";
import debounce from "lodash/debounce";

export function useScroll() {
  const [scrollY, setScrollY] = useState(0);
  const listener = () => {
    setScrollY(window.pageYOffset);
  };

  const delay = 15;

  useEffect(() => {
    window.addEventListener("scroll", debounce(listener, delay));
    return () => window.removeEventListener("scroll", listener);
  });

  return {
    scrollY,
  };
}
