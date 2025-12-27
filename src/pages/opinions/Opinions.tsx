import React, { useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { isEmpty } from 'lodash';
import { GetOpinionsResponse } from 'types/opinion';
import { GET_OPINIONS } from 'graphql/queries/opinion';
import useIsLogged from 'hooks/useIsLogged';
import LoadingModal from 'components/modals/LoadingModal';
import SuccessModal from 'components/modals/SuccessModal';
import ErrorModal from 'components/modals/ErrorModal';
import Pagination from 'components/Pagination';
import OpinionsList from './OpinionsList';
import EmptyOpinionsList from './EmptyOpinionsList';
import AddOpinionForm from './AddOpinionForm';

const Opinions = () => {
  const blockName = 'opinions';
  const quantityPerPage = 2;
  const isLogged = useIsLogged();
  const textareaRef = useRef<null | HTMLTextAreaElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [isOpinionAdded, setIsOpinionAdded] = useState(false);
  const [isAddedOpinionError, setIsAddedOpinionError] = useState(false);
  const { loading, error, data, refetch } = useQuery<GetOpinionsResponse>(
    GET_OPINIONS,
    { variables: { input: { pagination: { page: activePage, quantityPerPage } } } }
  );

  const handlePaginationOnChange = (pageNumber: number) => setActivePage(pageNumber - 1);

  if (loading) return <LoadingModal isOpen={loading} info="Trwa pobieranie opini!" />;
  if (error) return <h1>error</h1>;

  const { opinionsDetails: { totalCount, opinions } } = data!;

  return (
    <div className={`main__${blockName} ${blockName}`}>
      {
        isEmpty(opinions)
          ? <EmptyOpinionsList textAreaRef={textareaRef} />
          : <OpinionsList opinions={opinions} />
      }
      <Pagination
        activePage={activePage}
        onChange={handlePaginationOnChange}
        itemsQuantity={totalCount}
        quantityPerPage={quantityPerPage}
      />
      {
        isLogged && (
          <AddOpinionForm
            setIsOpinionAdded={setIsOpinionAdded}
            setIsAddedOpinionError={setIsAddedOpinionError}
            textareaRef={textareaRef}
            refetchOpinions={refetch}
          />
        )
      }
      <SuccessModal
        isOpen={isOpinionAdded}
        handleOnClose={() => setIsOpinionAdded(false)}
        info="Dziękujemy za dodanie opini!"
      />
      <ErrorModal
        isOpen={isAddedOpinionError}
        handleOnClose={() => setIsAddedOpinionError(false)}
        info="Niestety nie udało się dodać nowej opini."
      />
    </div>
  );
};

export default Opinions;
