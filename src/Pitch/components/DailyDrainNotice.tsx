import React, { forwardRef } from 'react';
import './DailyDrainNotice.less';

interface Props {
  // dismissed automatically when stat animation ends
}

const DailyDrainNotice = React.memo(
  forwardRef<HTMLDivElement, Props>(function DailyDrainNotice(_props, ref) {
    return (
      <div className="pt-drain-notice" ref={ref}>
        <span className="pt-drain-notice__text">DAILY BURN</span>
      </div>
    );
  })
);

DailyDrainNotice.displayName = 'DailyDrainNotice';
export default DailyDrainNotice;
