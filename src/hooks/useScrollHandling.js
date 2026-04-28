import { useEffect, useRef, useState } from 'react';

const useScrollHandling = () => {
  const [scrollDriction, setScrollDrection] = useState(null);
  const previousScrollPosition = useRef(0);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollTracking = () => {
    const currentScrollPosition = window.pageXOffset;
    if (currentScrollPosition > previousScrollPosition.current) {
      setScrollDrection('down');
    } else if (currentScrollPosition < previousScrollPosition.current) {
      setScrollDrection('up');
    }
    previousScrollPosition.current =
      currentScrollPosition <= 0 ? 0 : currentScrollPosition;
    setScrollDrection(currentScrollPosition);
  };
  useEffect(() => {
    window.addEventListener('scroll', scrollTracking);
    return () => window.removeEventListener('scroll', scrollTracking);
  }, []);
  return {
    scrollDriction,
    scrollPosition,
  };
};
export default useScrollHandling;
