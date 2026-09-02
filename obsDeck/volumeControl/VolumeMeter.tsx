import React from 'react';
import { useObsWebsocketContext } from './VolumeContext';

interface VolumeMeterProps {
  channel: 'l' | 'r';
  meterIndex: string;
  muted: boolean;
}

export default function VolumeMeter(props: VolumeMeterProps) {
  const { meterIndex, channel, muted } = props;
  const { meters } = useObsWebsocketContext();

  if (!meters[meterIndex]) {
    return null;
  }

  const level = meters[meterIndex].inputLevelsMul[channel === 'l' ? 0 : 1][1];

  let scaleDim = window.innerWidth < 600 ? 'Y' : 'Y';

  let levelStyle = {
    level: {
      clipPath: `polygon(${scaleDim == 'X' ? level * 100 : 100}% ${scaleDim == 'Y' ? 100 - level * 100 : 0}%, 0% ${scaleDim == 'Y' ? 100 - level * 100 : 0}%, 0% 100%, ${scaleDim == 'X' ? level * 100 : 100}% 100%)`,
    },
  };

  return (
    <div className='deck-volume-meter-bar' style={{ filter: `saturate(${muted ? 0 : 1.0})` }}>
      <div className='deck-volume-meter-bar-peak'></div>
      <div className='deck-volume-meter-bar-level' style={levelStyle.level}></div>
      <div className='deck-volume-meter-bar-power'></div>
    </div>
  );
}
