import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { exact, arrayOf, shape, string } from 'prop-types';
import clsx from 'clsx';
import { sortAvatarByMainField } from 'services/user.ts';
import { UPDATE_USER_AVATARS } from 'graphql/mutations/user.ts';
import { updateAvatars } from 'redux_/user/actionsCreator.ts';
import SubmitButton from 'components/SubmitButton.tsx';
import LoadingModal from 'components/modals/LoadingModal.tsx';
import SuccessModal from 'components/modals/SuccessModal.tsx';
import ErrorModal from 'components/modals/ErrorModal.tsx';

const PresentAvatarsContent = ({ avatars }) => {
  const blockName = 'present-avatars';
  const avatarsCopy = JSON.parse(JSON.stringify(avatars));
  const { loggedUserId } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [avatarsToUpdate, setAvatarsToUpdate] = useState(avatarsCopy);
  const [updatingAvatarSuccess, setUpdatingAvatarSuccess] = useState(false);
  const [updatingAvatarError, setUpdatingAvatarError] = useState(false);

  const [updateUserAvatars, { loading, data }] = useMutation(UPDATE_USER_AVATARS, {
    variables: { input: { userId: loggedUserId, avatars: avatarsToUpdate } },
    onError: () => setUpdatingAvatarError(true),
    onCompleted: () => {
      setUpdatingAvatarSuccess(true);
      dispatch(updateAvatars(data));
    }
  });

  const handleAvatarOnClick = (index) => {
    const newAvatarsSelection = avatarsCopy.map((avatar, avatarIndex) => ({
      main: avatarIndex === selectedAvatar,
      storagePath: avatar.storagePath
    }));

    setSelectedAvatar(index);
    setAvatarsToUpdate(newAvatarsSelection);
  };

  return (
    <div className={blockName}>
      <h1 className={`${blockName}__header`}>Zarządzaj avatarami</h1>
      <div className={`${blockName}__avatars-list-wrapper`}>
        <ul className={`${blockName}__avatars-list`}>
          {
            avatarsCopy.sort(sortAvatarByMainField).map((avatar, index) => (
                <div
                  className={clsx(
                    `${blockName}__list-item-wrapper`,
                    selectedAvatar === index && `${blockName}__list-item-wrapper--selected`
                  )}
                  onMouseDown={() => handleAvatarOnClick(index)}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={avatar.storagePath}
                    alt="Avatar"
                    className={`${blockName}__list-item`}
                  />
                </div>
              ))
          }
        </ul>
      </div>
      <SubmitButton
        onMouseDown={updateUserAvatars}
        value="Zaktualizuj avatary"
        classNames={`${blockName}__submit-button`}
      />
      <LoadingModal
        isOpen={loading}
        info="Trwa zaktualizacja avatarów!"
      />
      <SuccessModal
        isOpen={updatingAvatarSuccess}
        handleOnClose={() => setUpdatingAvatarSuccess(false)}
        info="Avatary zostały pomyślnie zaktualizowane!"
      />
      <ErrorModal
        isOpen={updatingAvatarError}
        handleOnClose={() => setUpdatingAvatarError(false)}
        body={<p>Niestety nie udało się zaktualizować avatarów.</p>}
      />
    </div>
  );
};

PresentAvatarsContent.propTypes = exact({
  avatars: arrayOf(
    shape({
      main: string.isRequired,
      storagePath: string.isRequired
    }).isRequired
  ).isRequired
}).isRequired;

export default PresentAvatarsContent;
