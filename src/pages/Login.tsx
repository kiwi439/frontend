import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation, ServerError } from '@apollo/client';
import { RootState } from 'types/store';
import { TextInputOnChange } from 'types/events';
import { LoginUserResponse } from 'types/user';
import useRedirect from 'hooks/useRedirect';
import { ERROR_CODES } from 'data/errors';
import { LOGIN_USER } from 'graphql/mutations/user';
import { login } from 'redux_/user/actionsCreator';
import { handleLoginValidation } from 'services/user';
import FormContainer from 'components/containers/FormContainer';
import TextInput from 'components/inputs/TextInput';
import SubmitButton from 'components/SubmitButton';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';

const Login = () => {
  const blockName = 'login';
  const dispatch = useDispatch();
  const { loggedUserId } = useSelector((store: RootState) => store.user);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [loginFail, setLoginFail] = useState(false);
  const [loginFailMessage, setLoginFailMessage] = useState('');

  const [loginUser, { loading }] = useMutation<LoginUserResponse>(LOGIN_USER, {
    onCompleted: (data) => {
      dispatch(login(data));
    },
    onError: (error) => {
      const statusCode = (error.networkError as ServerError)?.statusCode;

      if (statusCode === 500) {
        setLoginFailMessage('Niestety nie udało się zalogować!');
      } else {
        const errorCode = (error.graphQLErrors[0].extensions as { error_code: string }).error_code;

        if (errorCode === ERROR_CODES.USER_NOT_FOUND) {
          setLoginFailMessage('Użytkownik o takim adresie email nie istnieje!');
        } else if (errorCode === ERROR_CODES.INVALID_CREDENTIALS) {
          setLoginFailMessage('Niepoprawne hasło!');
        } else {
          setLoginFailMessage('Niestety nie udało się zalogować!');
        }
      }

      setLoginFail(true);
    }
  });

  const handleEmailOnChange = ({ target: { value } }: TextInputOnChange) => setEmail(value);
  const handlePasswordOnChange = ({ target: { value } }: TextInputOnChange) => setPassword(value);

  const handleLoginOnMouseDown = () => {
    const { emailError, passwordError, validationStatus } = handleLoginValidation(email, password);
    setEmailErrorMessage(emailError);
    setPasswordErrorMessage(passwordError);
    if (!validationStatus) return;

    loginUser({ variables: { input: { email, password } } });
  };

  const handleModalClose = () => {
    setLoginFail(false);
    setLoginFailMessage('');
  };

  useRedirect({ path: '/', shouldRedirect: !!loggedUserId });

  return (
    <div className={blockName}>
      <FormContainer
        header={(
          <Fragment>
            <Link to="/login">
              <span className={`${blockName}__active-link`}>
                {'Logowanie '}
              </span>
            </Link>
            <Link to="/register">Rejestracja</Link>
          </Fragment>
        )}
        form={(
          <Fragment>
            <TextInput
              placeholder="Adres email"
              classNames="text-input--login"
              value={email}
              onChange={handleEmailOnChange}
              validationError={emailErrorMessage}
              type="email"
            />
            <TextInput
              placeholder="Hasło"
              type="password"
              classNames="text-input--login"
              value={password}
              onChange={handlePasswordOnChange}
              validationError={passwordErrorMessage}
            />
            <SubmitButton
              onMouseDown={handleLoginOnMouseDown}
              classNames="button--login"
              value="Zaloguj się"
            />
          </Fragment>
        )}
      />
      <LoadingModal
        isOpen={loading}
        info="Trwa logowanie użytkownika!"
      />
      <ErrorModal
        isOpen={loginFail}
        handleOnClose={handleModalClose}
        body={<p>{loginFailMessage}</p>}
      />
    </div>
  );
};

export default Login;
