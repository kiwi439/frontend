import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMutation } from '@apollo/client';
import { RootState } from 'types/store';
import { TextInputOnChange } from 'types/events';
import { ADD_OPINION } from 'graphql/mutations/opinion';
import { handleAddOpinionValidation } from 'services/opinions';
import FormContainer from 'components/containers/FormContainer';
import Rating from 'components/Rating';
import TextArea from 'components/inputs/TextArea';
import SubmitButton from 'components/SubmitButton';

type AddOpinionFormProps = {
  setIsOpinionAdded: (isOpinionAdded: boolean) => void,
  setIsAddedOpinionError: (isError: boolean) => void,
  refetchOpinions: () => Promise<void>,
  textareaRef: React.RefObject<HTMLTextAreaElement>
};

const AddOpinionForm = ({ setIsOpinionAdded, setIsAddedOpinionError, textareaRef, refetchOpinions }: AddOpinionFormProps) => {
  const theHighestMark = 5;
  const userId = useSelector((store: RootState) => store.user.loggedUserId);
  const [rating, setRating] = useState(theHighestMark);
  const [opinionValidationError, setOpinionValidationError] = useState('');
  const [addedOpinion, setAddedOpinion] = useState('');
  const [addOpinion] = useMutation(ADD_OPINION, {
    onCompleted: async () => {
      try {
        await refetchOpinions();
        clearForm();
        setIsOpinionAdded(true);
      } catch (error) {
        setIsAddedOpinionError(true);
      }
    },
    onError: () => setIsAddedOpinionError(true)
  });

  const handleAddOpinionOnChange = ({ target: { value } }: TextInputOnChange) => setAddedOpinion(value);

  const handleSetRating = ({ target: { value } }: TextInputOnChange) => {
    const numberSystem = 10;
    const parsedValue = parseInt(value, numberSystem);

    setRating(parsedValue);
  };

  const handleAddOpinionSubmit = () => {
    const { opinionError, validationStatus } = handleAddOpinionValidation(addedOpinion);

    setOpinionValidationError(opinionError);
    if (!validationStatus) return;

    addOpinion({ variables: { input: { content: addedOpinion, mark: rating, userId } } });
  };

  const clearForm = () => {
    setAddedOpinion('');
    setRating(theHighestMark);
  };

  return (
    <FormContainer
      header="Dodaj opinie"
      form={(
        <Fragment>
          <TextArea
            value={addedOpinion}
            onChange={handleAddOpinionOnChange}
            classNames="text-area--add-opinion"
            placeholder="Dodaj opinię"
            textareaRef={textareaRef}
            validationError={opinionValidationError}
            dataTestId="opinion-textarea"
          />
          <Rating
            value={rating}
            readOnly={false}
            onChange={handleSetRating}
            classes="rating--add-opinion"
          />
          <SubmitButton
            onMouseDown={handleAddOpinionSubmit}
            value="Wyślij"
            classNames="button--add-opinion"
            dataTestId="add-opinion-submit-button"
          />
        </Fragment>
      )}
    />
  );
};

export default AddOpinionForm;
