import React, { ReactElement } from 'react';

type CheckBoxProps = {
  label: string | ReactElement,
  checked: boolean,
  classNames?: string,
  dataTestId?: string
  onChange?: () => void
};

const CheckBox = ({ label, checked, onChange = () => {}, classNames = '', dataTestId = '' }: CheckBoxProps) => (
  <div className="checkbox__wrapper">
    <input
      type="checkbox"
      className={`checkbox ${classNames}`}
      onChange={onChange}
      checked={checked}
      data-testid={dataTestId}
    />
    {label}
  </div>
);

export default CheckBox;
