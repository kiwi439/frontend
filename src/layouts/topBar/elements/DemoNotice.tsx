import React from 'react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DemoNotice = () => {
  const blockName = 'top-bar-elements';

  return (
    <div className={`${blockName}__demo-notice`} role="note">
      <InfoOutlinedIcon className={`${blockName}__demo-notice-icon`} />
      <p className={`${blockName}__demo-notice-content`}>
        <span className={`${blockName}__demo-notice-title`}>Wersja testowa</span>
        {' — środowisko do prezentacji funkcji sklepu. Płatności Stripe nie generują prawdziwych obciążeń.'}
      </p>
    </div>
  );
};

export default DemoNotice;
