import React, { Fragment, useState } from 'react';
import Logo from './elements/Logo';
import HamburgerMenu from './elements/HamburgerMenu';
import Drawer from 'components/Drawer';
import Authorization from './elements/Authorization';
import MenuList from './elements/MenuList';
import Basket from './elements/basket/Basket';
import DemoNotice from './elements/DemoNotice';

const MobileContent = () => {
  const blockName = 'top-bar-elements';
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Fragment>
      <div className={`${blockName} ${blockName}--mobile`}>
        <Logo />
        <HamburgerMenu handleOnMouseDown={() => setIsDrawerOpen(true)} />
        <DemoNotice />
      </div>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        className="drawer--top-bar"
      >
        <div className={`${blockName} ${blockName}--drawer`} data-testid="menu-drawer">
          <Authorization />
          <div className={`${blockName}__divider`} />
          <MenuList />
          <div className={`${blockName}__divider`} />
          <Basket />
        </div>
      </Drawer>
    </Fragment>
  );
};

export default MobileContent;
