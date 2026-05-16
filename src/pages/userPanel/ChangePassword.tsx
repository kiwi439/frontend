import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { RootState } from 'types/store';
import { TextInputOnChange } from 'types/events';
import { CHANGE_USER_PASSWORD } from 'graphql/mutations/user';
import { handleChangePasswordValidation } from 'services/user';
import TextInput from 'components/inputs/TextInput';
import SubmitButton from 'components/SubmitButton';
import SuccessModal from 'components/modals/SuccessModal';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';

const ChangePassword = () => {
  const blockName = 'change-password';
  const { loggedUserId } = useSelector((store: RootState) => store.user);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordValidationError, setPasswordValidationError] = useState('');
  const [passwordIdentityValidationError, setPasswordIdentityValidationError] = useState('');
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState(false);
  const [changeUserPassword, { loading }] = useMutation(CHANGE_USER_PASSWORD, {
    variables: { input: { password, userId: loggedUserId } },
    onError: () => setChangePasswordError(true),
    onCompleted: () => setChangePasswordSuccess(true)
  });

  const handlePasswordOnChange = ({ target: { value } }: TextInputOnChange) => setPassword(value);
  const handlePasswordConfirmationOnChange = ({ target: { value } }: TextInputOnChange) => setPasswordConfirmation(value);

  const clearForm = () => {
    setPassword('');
    setPasswordConfirmation('');
  };

  const handleSubmitOnMouseDown = () => {
    const { passwordError, passwordIdentityError, validationStatus } = handleChangePasswordValidation(password, passwordConfirmation);

    setPasswordValidationError(passwordError);
    setPasswordIdentityValidationError(passwordIdentityError);
    if (!validationStatus) return;

    clearForm();
    changeUserPassword();
  };

  return (
    <div className={blockName}>
      <h1 className={`${blockName}__header`}>Zmień hasło</h1>
      <form className={`${blockName}__form`}>
        <TextInput
          placeholder="Nowe hasło"
          classNames="text-input--change-password"
          type="password"
          value={password}
          onChange={handlePasswordOnChange}
          validationError={passwordValidationError}
        />
        <TextInput
          placeholder="Potwierdź nowe hasło"
          classNames="text-input--change-password"
          type="password"
          value={passwordConfirmation}
          onChange={handlePasswordConfirmationOnChange}
          validationError={passwordIdentityValidationError}
        />
        <SubmitButton
          value="Zapisz"
          classNames="button--change-password"
          onMouseDown={handleSubmitOnMouseDown}
        />
      </form>
      <SuccessModal
        isOpen={changePasswordSuccess}
        handleOnClose={() => setChangePasswordSuccess(false)}
        info="Hasło zostało zmienione!"
      />
      <LoadingModal
        isOpen={loading}
        info="Trwa zmiana hasła"
      />
      <ErrorModal
        isOpen={changePasswordError}
        handleOnClose={() => setChangePasswordError(false)}
        body={<p>Niestety nie udało się zmienić hasła.</p>}
      />
    </div>
  );
};

export default ChangePassword;
