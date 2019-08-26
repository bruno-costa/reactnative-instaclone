import React, {useEffect} from 'react';
import {Animated} from 'react-native';

import {Small, ImageOriginal} from './styles';

const AnimatedImageOriginal = Animated.createAnimatedComponent(ImageOriginal);

export default function LazyImage({preSource, source, aspectRatio}) {
  const opacity = new Animated.Value(0);
  useEffect(() => {}, []);

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
      <AnimatedImageOriginal
        style={{opacity}}
        source={source}
        ratio={aspectRatio}
        resizeMode="contain"
        onLoadEnd={handleAnimate}
      />
    </Small>
  );
}
