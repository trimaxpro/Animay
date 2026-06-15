import { useEffect, useRef, useState } from 'react';

export function useInfiniteScroll(callback: () => void, hasMore: boolean) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    if (!element || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) callback();
      },
      { threshold: 0.1 },
    );

    observerRef.current.observe(element);
    return () => observerRef.current?.disconnect();
  }, [element, hasMore, callback]);

  return { ref: setElement };
}
