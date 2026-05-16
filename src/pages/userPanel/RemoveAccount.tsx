import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { RootState } from 'types/store';
import { REMOVE_ACCOUNT } from 'graphql/mutations/user';
import { logout } from 'redux_/user/actionsCreator';
import SubmitButton from 'components/SubmitButton';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';
import SuccessModal from 'components/modals/SuccessModal';

const RemoveAccount = () => {
  const blockName = 'remove-account';
  const dispatch = useDispatch();
  const { loggedUserId } = useSelector((store: RootState) => store.user);
  const [removingAccountError, setRemovingAccountError] = useState(false);
  const [removingAccountSuccess, setRemovingAccountSuccess] = useState(false);

  const handleOnCloseSuccessModal = () => {
    setRemovingAccountSuccess(false);
    dispatch(logout());
  };

  const [removeAccount, { loading }] = useMutation(REMOVE_ACCOUNT, {
    variables: { userId: loggedUserId },
    onCompleted: () => setRemovingAccountSuccess(true),
    onError: () => setRemovingAccountError(true)
  });

  return (
    <div className={blockName}>
      <h1 className={`${blockName}__header`}>Usuń konto</h1>
      <p className={`${blockName}__consequences-text`}>
        Usunięcie konta wiąże się z straceniem wszystkich informacji o zamówieniach,<br />
        usunięciem dodanych opini oraz wypisaniu z newslettera.
      </p>
      <SubmitButton
        value="Usuń konto!"
        classNames="button--change-password"
        onMouseDown={removeAccount}
      />
      <LoadingModal
        isOpen={loading}
        info="Twoje konto jest usuwane!"
      />
      <ErrorModal
        isOpen={removingAccountError}
        handleOnClose={() => setRemovingAccountError(false)}
        body={<p>Niestety nie udało się usunąć konta!</p>}
      />
      <SuccessModal
        isOpen={removingAccountSuccess}
        handleOnClose={handleOnCloseSuccessModal}
        info="Twoje konto zostało pomyślnie usunięte!"
      />
    </div>
  );
};

export default RemoveAccount;
