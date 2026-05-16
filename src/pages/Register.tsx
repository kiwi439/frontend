import React, { Fragment, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'types/store';
import { useMutation, ServerError } from '@apollo/client';
import { TextInputOnChange, FileInputOnChange } from 'types/events';
import { Avatars } from 'types/avatar';
import useRedirect from 'hooks/useRedirect';
import { login } from 'redux_/user/actionsCreator';
import { handleRegisterValidation, generateAvatars } from 'services/user';
import { REGISTER_USER } from 'graphql/mutations/user';
import FormContainer from 'components/containers/FormContainer';
import TextInput from 'components/inputs/TextInput';
import FileInput from 'components/inputs/FileInput';
import SubmitButton from 'components/SubmitButton';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';
import { ERROR_CODES } from 'data/errors';

const Register = () => {
  const blockName = 'register';
  const dispatch = useDispatch();
  const fileInput = useRef<null | HTMLInputElement>(null);
  const { loggedUserId } = useSelector((store: RootState) => store.user);
  const [avatars, setAvatars] = useState<Avatars>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [avatarsErrorMessages, setAvatarsErrorMessages] = useState('');
  const [registerUserError, setRegisterUserError] = useState(false);
  const [registerUserErrorMesage, setRegisterUserErrorMesage] = useState('');

  const [registerUser, { loading, data }] = useMutation(REGISTER_USER, {
    onError: (error) => {
      const statusCode = (error.networkError as ServerError)?.statusCode;

      if (statusCode === 500) {
        setRegisterUserErrorMesage('Niestety nie udało się zarejestrować nowego konta.');
      } else {
        const errorCode = (error.graphQLErrors[0].extensions as { error_code: string }).error_code;

        if (errorCode === ERROR_CODES.EMAIL_ALREADY_TAKEN) {
          setRegisterUserErrorMesage('Adres email jest już zajęty!');
        } else {
          setRegisterUserErrorMesage('Niestety nie udało się zarejestrować nowego konta');
        }
      }

      setRegisterUserError(true);
    },
    onCompleted: () => {
      clearForm();
      loginUser();
    }
  });

  const handleEmailOnChange = ({ target: { value } }: TextInputOnChange) => setEmail(value);
  const handlePasswordOnChange = ({ target: { value } }: TextInputOnChange) => setPassword(value);

  const handleFileOnChange = async ({ target: { files } }: FileInputOnChange) => {
    const generatedAvatars = await generateAvatars(files);

    setAvatars(generatedAvatars);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { emailError, passwordError, avatarError, validationStatus } = handleRegisterValidation(email, password, avatars);

    setEmailErrorMessage(emailError);
    setPasswordErrorMessage(passwordError);
    setAvatarsErrorMessages(avatarError);
    if (!validationStatus) return;

    registerUser({ variables: { input: { email, password, avatars } } });
  };

  const clearForm = () => {
    setAvatars([]);
    setEmail('');
    setPassword('');
    fileInput.current!.value = '';
  };

  const loginUser = () => dispatch(login(data));

  useRedirect({ path: '/', shouldRedirect: !!loggedUserId });

  return (
    <div className={blockName}>
      <FormContainer
        header={(
          <Fragment>
            <Link to="/login">Logowanie</Link>
            <Link to="/register">
              <span className={`${blockName}__active-link`}> Rejestracja</span>
            </Link>
          </Fragment>
        )}
        form={(
          <Fragment>
            <TextInput
              placeholder="Email"
              classNames="text-input--register"
              onChange={handleEmailOnChange}
              value={email}
              validationError={emailErrorMessage}
              type="email"
              dataTestId="register-email-input"
            />
            <TextInput
              placeholder="Password"
              type="password"
              classNames="text-input--register"
              onChange={handlePasswordOnChange}
              value={password}
              validationError={passwordErrorMessage}
              dataTestId="register-password-input"
            />
            <FileInput
              classNames="file-input--register"
              onChange={handleFileOnChange}
              innerRef={fileInput}
              validationError={avatarsErrorMessages}
              dataTestID="register-file-input"
            />
            <SubmitButton
              classNames="button--register"
              onMouseDown={handleSubmit}
              value="Załóż konto"
              dataTestId="register-submit-button"
            />
          </Fragment>
        )}
      />
      <LoadingModal
        isOpen={loading}
        info="Rejestrujemy użytkownika!"
      />
      <ErrorModal
        isOpen={registerUserError}
        handleOnClose={() => setRegisterUserError(false)}
        body={<p>{registerUserErrorMesage}</p>}
      />
    </div>
  );
};

export default Register;
