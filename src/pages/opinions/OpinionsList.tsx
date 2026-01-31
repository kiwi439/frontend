import React from 'react';
import { Opinions } from 'types/opinion';
import Opinion from './Opinion';

type OpinionsListProps = { opinions: Opinions }

const OpinionsList = ({ opinions }: OpinionsListProps) => {
  const blockName = 'opinions';

  return (
    <div className={`${blockName}__opinion-list-wrapper`}>
      { opinions.map((opinion, index) => <Opinion opinion={opinion} index={index} key={opinion.id} />) }
    </div>
  );
};

export default OpinionsList;
