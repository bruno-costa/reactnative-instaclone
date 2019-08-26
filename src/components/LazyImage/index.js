import React, {useEffect, useState} from 'react';
import {Animated} from 'react-native';

import {Small, ImageOriginal} from './styles';

const AnimatedImageOriginal = Animated.createAnimatedComponent(ImageOriginal);

export default function LazyImage({
  preSource,
  source,
  aspectRatio,
  loadImage = true,
}) {
  const opacity = new Animated.Value(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (loadImage && !loaded) {
      setLoaded(true);
    }
  }, [loadImage, loaded]);

  function handleAnimate() {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }

  return (
    <Small
      source={preSource}
      ratio={aspectRatio}
      resizeMode="contain"
      blurRadius={2}>
      {loaded && (
        <AnimatedImageOriginal
          style={{opacity}}
          source={source}
          ratio={aspectRatio}
          resizeMode="contain"
          onLoadEnd={handleAnimate}
        />
      )}
    </Small>
  );
}
