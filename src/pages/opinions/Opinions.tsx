import React, { useState, useRef, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
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
  const [cursors, setCursors] = useState<(string | null)[]>([]);
  const [opinionsResponse, setOpinionsResponse] = useState<GetOpinionsResponse['opinions'] | null>(null);
  const [isOpinionAdded, setIsOpinionAdded] = useState(false);
  const [isAddedOpinionError, setIsAddedOpinionError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [fetchOpinions] = useLazyQuery<GetOpinionsResponse>(GET_OPINIONS);

  const handlePaginationOnChange = (pageNumber: number) => setActivePage(pageNumber - 1);

  const processFetchingOpinions = async ({ targetPage, currentCursors }: { targetPage: number; currentCursors: (string | null)[] }) => {
    const newCursors = [...currentCursors];
    const startPage = Math.min(targetPage, currentCursors.length);

    for (let page = startPage; page <= targetPage; page++) {
      const after = page === 0 ? undefined : (newCursors[page - 1] ?? undefined);
      const result = await fetchOpinions({ variables: { first: quantityPerPage, after }, fetchPolicy: 'network-only' });

      if (result.error) {
        setError(result.error.message);
        setIsLoading(false);
        return;
      }

      newCursors[page] = result.data!.opinions.pageInfo.endCursor;
      if (page === targetPage) setOpinionsResponse(result.data!.opinions);
    }

    setCursors(newCursors);
    setIsLoading(false);
  };

  const refetch = async () => {
    setCursors([]);
    setActivePage(0);
    setIsLoading(true);
    setError(null);
    await processFetchingOpinions({ targetPage: 0, currentCursors: [] });
  };

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    processFetchingOpinions({ targetPage: activePage, currentCursors: cursors });
  }, [activePage]);

  if (isLoading) return <LoadingModal isOpen={isLoading} info="Trwa pobieranie opini!" />;
  if (error) return <h1>error</h1>;

  const opinions = (opinionsResponse!.edges).map((edge) => edge.node);
  const totalCount = opinionsResponse!.totalCount;

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
        body={<p>Niestety nie udało się dodać nowej opini.</p>}
      />
    </div>
  );
};

export default Opinions;
