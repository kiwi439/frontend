import React, { ReactNode } from 'react';
import { Modal } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

type ErrorModalProps = { isOpen: boolean, body: ReactNode, handleOnClose: () => void };

const ErrorModal = ({ isOpen, handleOnClose, body }: ErrorModalProps) => {
  const blockName = 'modal';

  return (
    <Modal
      open={isOpen}
      onClose={handleOnClose}
      className={`${blockName} ${blockName}--error`}
    >
      <div className={`${blockName}__content-wrapper`}>
        <ErrorIcon className={`${blockName}__error-icon`} />
        <h2 className={`${blockName}__header`}>Wystąpił niespodziewany problem!</h2>
        <p>Za utrudnienia przepraszamy</p>
        {body}
      </div>
    </Modal>
  );
};

export default ErrorModal;
