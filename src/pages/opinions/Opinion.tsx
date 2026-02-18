import React, { Fragment, useState, useEffect } from 'react';
import SmoothCollapse from 'react-smooth-collapse';
import { isEmpty } from 'lodash';
import { Opinion as OpinionType } from 'types/opinion';
import { formatTimestamp } from 'utils/helpers';
import ShadowedContainer from 'components/containers/ShadowedContainer';
import Rating from 'components/Rating';
import Avatar from 'components/Avatar.jsx';
import { APPEARING_IN_SEQUENCE } from 'data/animations';
import { generateOpinionContent } from 'services/opinions';

type OpinionProps = { opinion: OpinionType, index: number };

const Opinion = ({ opinion: { content, mark, updatedAt, user: { email, avatars } }, index }: OpinionProps) => {
  const blockName = 'opinion';
  const displayedNumberOfChars = 25;
  const [contentExpanded, setContentExpanded] = useState(false);
  const [presentedNarrowContent, setPresentedNarrowContent] = useState('');
  const [presentedRestOfContent, setPresentedRestOfContent] = useState('');
  const [isTextToLongToDisplay, setIsTextToLongToDisplay] = useState(false);

  const handleExpandContentOnMouseDown = () => setContentExpanded(!contentExpanded);

  useEffect(() => {
    const {
      narrowContent,
      restOfContent,
      textToLongToDisplay
    } = generateOpinionContent(displayedNumberOfChars, content, contentExpanded);

    setPresentedNarrowContent(narrowContent);
    setPresentedRestOfContent(restOfContent);
    setIsTextToLongToDisplay(textToLongToDisplay);
  }, [contentExpanded]);

  return (
    <ShadowedContainer
      classNames={blockName}
      dataTestId="opinion-container"
      animationAttributes={{
        variants: APPEARING_IN_SEQUENCE,
        custom: index,
        initial: APPEARING_IN_SEQUENCE.hidden,
        animate: APPEARING_IN_SEQUENCE.visible(index)
      }}
    >
      <Fragment>
        <div className={`${blockName}__picture-wrapper`}>
          <Avatar
            avatars={avatars}
            classNames={`${blockName}__picture`}
          />
        </div>
        <div className={`${blockName}__user-email`}>{email}</div>
        <div className={`${blockName}__updated-at`}>{formatTimestamp(updatedAt)}</div>
        <div className={`${blockName}__mark`}>
          <Rating value={mark} readOnly />
        </div>
        <div className={`${blockName}__content-wrapper`}>
          <div className={`${blockName}__content`}>
            { presentedNarrowContent }
            {
              !isEmpty(presentedRestOfContent) && (
                <SmoothCollapse expanded={contentExpanded}>
                  { presentedRestOfContent }
                </SmoothCollapse>
              )
            }
          </div>
          {
            isTextToLongToDisplay && (
              <span
                className={`${blockName}__content-expander`}
                onMouseDown={handleExpandContentOnMouseDown}
                role="button"
                tabIndex={0}
              >
                { contentExpanded ? 'Schowaj' : 'Czytaj więcej' }
              </span>
            )
          }
        </div>
      </Fragment>
    </ShadowedContainer>
  );
};

export default Opinion;
