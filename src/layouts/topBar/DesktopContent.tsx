import React from 'react';
import Basket from './elements/basket/Basket';
import Logo from './elements/Logo';
import Authorization from './elements/Authorization';
import MenuList from './elements/MenuList';
import DemoNotice from './elements/DemoNotice';

const DesktopContent = () => {
  const blockName = 'top-bar-elements';

  return (
    <div className={`${blockName} ${blockName}--desktop`}>
      <Logo />
      <MenuList />
      <DemoNotice />
      <Authorization />
      <Basket />
    </div>
  );
};

export default DesktopContent;
