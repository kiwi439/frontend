import React, { Fragment, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLazyQuery, useMutation } from '@apollo/client';
import { RootState } from 'types/store';
import { TextInputOnChange } from 'types/events';
import { USER_PERSONAL_DETAILS, IS_USER_SAVED_TO_NEWSLETTER } from 'graphql/queries/user';
import { SUBSCRIBE_TO_NEWSLETTER } from 'graphql/mutations/user';
import useIsLogged from 'hooks/useIsLogged';
import { handleSaveToNewsletterValidation } from 'services/newsletter';
import FormContainer from 'components/containers/FormContainer';
import TextInput from 'components/inputs/TextInput';
import SubmitButton from 'components/SubmitButton';
import SuccessModal from 'components/modals/SuccessModal';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';

const Newsletter = () => {
  const blockName = 'newsletter';
  const { loggedUserId } = useSelector((store: RootState) => store.user);
  const isLogged = useIsLogged();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [nameErrorMessage, setNameErrorMessage] = useState('');
  const [surnameErrorMessage, setSurnameErrorMessage] = useState('');
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [subscribingToNewsletterSuccess, setSubscribingToNewsletterSuccess] = useState(false);
  const [subscribingToNewsletterError, setSubscribingToNewsletterError] = useState(false);
  const [isUserSavedToNewsletter, setIsUserSavedToNewsletter] = useState(false);

  const [fetchPersonalDetails] = useLazyQuery(
    USER_PERSONAL_DETAILS,
    {
      variables: { userId: loggedUserId },
      onCompleted: (data) => {
        const { user: { name: userName, surname: userSurname, email: userEmail } } = data;

        setName(userName || '');
        setSurname(userSurname || '');
        setEmail(userEmail || '');
      }
    }
  );

  const [checkIfSavedToNewsletter, { refetch: checkIfSavedToNewsletterRefetch }] = useLazyQuery(
    IS_USER_SAVED_TO_NEWSLETTER,
    {
      variables: { userId: loggedUserId },
      fetchPolicy: 'network-only',
      onCompleted: ({ user: { savedToNewsletter } }) => setIsUserSavedToNewsletter(savedToNewsletter),
      onError: () => setIsUserSavedToNewsletter(false)
    }
  );

  const [subscribeToNewsletter, { loading: subscribingToNewsletterLoading }] = useMutation(SUBSCRIBE_TO_NEWSLETTER, {
    variables: { input: { email, name, surname } },
    onCompleted: () => {
      setSubscribingToNewsletterSuccess(true);
      clearForm();
    },
    onError: () => setSubscribingToNewsletterError(true)
  });

  const clearForm = () => {
    setName('');
    setSurname('');
    setEmail('');
  };

  const handleNameOnChange = ({ target: { value } }: TextInputOnChange) => setName(value);
  const handleSurnameOnChange = ({ target: { value } }: TextInputOnChange) => setSurname(value);
  const handleEmailOnChange = ({ target: { value } }: TextInputOnChange) => setEmail(value);

  const handleSaveToNewsletter = () => {
    const { nameError, surnameError, emailError, validationStatus } = handleSaveToNewsletterValidation(name, surname, email);

    setNameErrorMessage(nameError);
    setSurnameErrorMessage(surnameError);
    setEmailErrorMessage(emailError);
    if (!validationStatus) return;

    subscribeToNewsletter();
  };

  const handleErrorModalOnClose = () => setSubscribingToNewsletterError(false);

  const handleSuccessModalOnClose = async () => {
    setSubscribingToNewsletterSuccess(false);

    if (isLogged) {
      const { data: { user: { savedToNewsletter } } } = await checkIfSavedToNewsletterRefetch();
      setIsUserSavedToNewsletter(savedToNewsletter);
    };
  };

  useEffect(() => {
    if (!isLogged) {
      clearForm();
      return;
    }

    fetchPersonalDetails();
    checkIfSavedToNewsletter();
  }, [isLogged]);

  if (isLogged && isUserSavedToNewsletter) return null;

  return (
    <div className={blockName} id="newsletter-form">
      <FormContainer
        header="Zapisz się na newsletter aby być na bieżąco!"
        form={(
          <Fragment>
            <TextInput
              placeholder="Imię"
              classNames="text-input--newsletter"
              value={name}
              onChange={handleNameOnChange}
              validationError={nameErrorMessage}
              dataTestId="newsletter-name-input"
            />
            <TextInput
              placeholder="Nazwisko"
              classNames="text-input--newsletter"
              value={surname}
              onChange={handleSurnameOnChange}
              validationError={surnameErrorMessage}
              dataTestId="newsletter-surname-input"
            />
            <TextInput
              placeholder="Adres email"
              classNames="text-input--newsletter"
              value={email}
              type="email"
              onChange={handleEmailOnChange}
              validationError={emailErrorMessage}
              dataTestId="newsletter-email-input"
            />
            <SubmitButton
              onMouseDown={handleSaveToNewsletter}
              value="Zapisz"
              classNames="button--newsletter"
              dataTestId="newsletter-submit-button"
            />
          </Fragment>
        )}
      />
      <LoadingModal
        isOpen={subscribingToNewsletterLoading}
        info="Jesteś zapisywany na newsletter!"
      />
      <SuccessModal
        isOpen={subscribingToNewsletterSuccess}
        handleOnClose={handleSuccessModalOnClose}
        info="Zostałeś zapisany na newsletter!"
      />
      <ErrorModal
        isOpen={subscribingToNewsletterError}
        handleOnClose={handleErrorModalOnClose}
        body={<p>Niestety nie udało się zapisać na newsletter!</p>}
      />
    </div>
  );
};

export default Newsletter;
