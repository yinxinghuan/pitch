import React, { forwardRef } from 'react';
import { useLocale } from '../i18n';
import './DailyDrainNotice.less';

interface Props {
  // no interaction needed — dismissed automatically when stat animation ends
}

const DailyDrainNotice = React.memo(
  forwardRef<HTMLDivElement, Props>(function DailyDrainNotice(_props, ref) {
    const { getText } = useLocale();
    return (
      <div className="bs-drain-notice" ref={ref}>
        <span className="bs-drain-notice__text">
          {getText('每日消耗', 'DAILY DRAIN')}
        </span>
      </div>
    );
  })
);

DailyDrainNotice.displayName = 'DailyDrainNotice';
export default DailyDrainNotice;
