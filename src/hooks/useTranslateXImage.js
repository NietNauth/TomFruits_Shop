import useScrollHandling from '@assets/hooks/useScrollHandling';
import { useEffect, useState } from 'react';

const useTranslateXImage = () => {
  const { scrollPosition, scrollDriction } = useScrollHandling();
  const { translateXPosition, setTranslateXPosion } = useState(80);
  const handleTranslateX = () => {
    if (scrollDriction == 'down' && scrollPosition >= 1500) {
      setTranslateXPosion(translateXPosition <= 0 ? 0 : translateXPosition - 1);
    } else if (scrollDriction == 'up') {
      setTranslateXPosion(
        translateXPosition >= 80 ? 80 : translateXPosition + 1
      );
    }
  };
  useEffect(() => {
    handleTranslateX();
  }, [scrollPosition]);
  return {
    translateXPosition,
  };
};
export default useTranslateXImage;
