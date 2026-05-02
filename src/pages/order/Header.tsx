import React, { useContext } from 'react';
import { OrderContext } from 'contexts/contexts';
import Stepper from 'components/Stepper';

const LABELS = ['Dane odbiorcy', 'Sposób dostawy', 'Metoda płatności', 'Podsumowanie'];

const Header = () => {
  const { step, setStep } = useContext(OrderContext);

  const handleStepOnClick = (stepIndex: number) => {
    if (step > stepIndex) setStep(stepIndex);
  };

  return (
    <Stepper
      activeStep={step}
      handleStepOnClick={handleStepOnClick}
      labels={LABELS}
    />
  );
};

export default Header;
