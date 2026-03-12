import React, { forwardRef, useEffect, useState } from 'react';
import posterSrc from '../img/poster.png';
import bgRoom from '../img/bg_room.png';
import bgStream from '../img/bg_stream.png';
import jennyIdle from '../img/jenny_idle.png';
import jennyHappy from '../img/jenny_happy.png';
import jennySad from '../img/jenny_sad.png';
import jennySurprised from '../img/jenny_surprised.png';
import jennyTired from '../img/jenny_tired.png';
import jennyFocused from '../img/jenny_focused.png';
import jennyWorn from '../img/jenny_worn.png';
import jennyRundown from '../img/jenny_rundown.png';
import jennyManic from '../img/jenny_manic.png';
import jennyWreck from '../img/jenny_wreck.png';
import iconEnergy from '../img/icon_energy.png';
import iconComposure from '../img/icon_mood.png';
import iconVision from '../img/icon_focus.png';
import iconRunway from '../img/icon_followers.png';
import iconMorale from '../img/icon_connection.png';
import svDesk from '../img/sv_desk.png';
import svRest from '../img/sv_rest.png';
import svEat from '../img/sv_eat.png';
import svPhone from '../img/sv_phone.png';
import svWalk from '../img/sv_walk.png';
import svSetup from '../img/sv_setup.png';
import svRelax from '../img/sv_relax.png';
import svVideo from '../img/sv_video.png';
import svGame from '../img/sv_game.png';
import './SplashScreen.less';

const PRELOAD = [
  bgRoom, bgStream,
  jennyIdle, jennyHappy, jennySad, jennySurprised, jennyTired, jennyFocused,
  jennyWorn, jennyRundown, jennyManic, jennyWreck,
  iconEnergy, iconComposure, iconVision, iconRunway, iconMorale,
  svDesk, svRest, svEat, svPhone, svWalk, svSetup, svRelax, svVideo, svGame,
];
const MIN_MS = 2200;
const MAX_ASSET_MS = 10000;

interface Props { onDone: () => void; }

const SplashScreen = React.memo(
  forwardRef<HTMLDivElement, Props>(function SplashScreen({ onDone }, ref) {
    const [posterReady, setPosterReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fading, setFading] = useState(false);
    const [minDone, setMinDone] = useState(false);
    const [assetsDone, setAssetsDone] = useState(false);

    useEffect(() => {
      const t = setTimeout(() => setMinDone(true), MIN_MS);
      return () => clearTimeout(t);
    }, []);

    useEffect(() => {
      if (!posterReady) return;

      let loaded = 0;
      const total = PRELOAD.length;

      const onOne = () => {
        loaded++;
        setProgress(loaded / total);
        if (loaded >= total) setAssetsDone(true);
      };

      PRELOAD.forEach(src => {
        const img = new Image();
        img.onload = img.onerror = onOne;
        img.src = src;
      });

      const maxT = setTimeout(() => setAssetsDone(true), MAX_ASSET_MS);
      return () => clearTimeout(maxT);
    }, [posterReady]);

    useEffect(() => {
      if (minDone && assetsDone) setFading(true);
    }, [minDone, assetsDone]);

    useEffect(() => {
      if (!fading) return;
      const t = setTimeout(onDone, 500);
      return () => clearTimeout(t);
    }, [fading, onDone]);

    return (
      <div className={`pt-splash${fading ? ' pt-splash--fading' : ''}`} ref={ref}>
        <img
          className={`pt-splash__img${posterReady ? ' pt-splash__img--visible' : ''}`}
          src={posterSrc}
          alt="PITCH"
          draggable={false}
          onLoad={() => setPosterReady(true)}
        />
        <div className="pt-splash__bar-track">
          <div
            className="pt-splash__bar-fill"
            style={{ width: `${Math.round(progress * 100)}%` }}
          />
        </div>
      </div>
    );
  })
);

SplashScreen.displayName = 'SplashScreen';
export default SplashScreen;
