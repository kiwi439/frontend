import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'types/store';
import { useLazyQuery } from '@apollo/client';
import { GetOrdersResponse, Order } from 'types/orders';
import { GET_ORDERS } from 'graphql/queries/order';
import { formatTimestamp } from 'utils/helpers';
import fetchFileOnLocalFileSystem from 'services/fetchFileOnLocalFileSystem';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';
import Pagination from 'components/Pagination';
import Tooltip from 'components/Tooltip';

const History = () => {
  const blockName = 'history';
  const quantityPerPage = 5;
  const { loggedUserId } = useSelector((store: RootState) => store.user);
  const [activePage, setActivePage] = useState(0);
  const [cursors, setCursors] = useState<(string | null)[]>([]);
  const [ordersResponse, setOrdersResponse] = useState<GetOrdersResponse['orders'] | null>(null);
  const [downloadInvoiceTooltipOpen, setDownloadInvoiceTooltipOpen] = useState(false);
  const [fetchingOrdersError, setFetchingOrdersError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [fetchOrders] = useLazyQuery<GetOrdersResponse>(GET_ORDERS, {
    onError: () => setFetchingOrdersError(true)
  });

  const processFetchingOrders = async () => {
    let after: string | undefined;
    const newCursors = [...cursors];
    const startPage = activePage < cursors.length ? activePage : cursors.length;

    for (let page = startPage; page <= activePage; page++) {
      after = page === 0 ? undefined : (newCursors[page - 1] ?? undefined);
      const result = await fetchOrders({ variables: { first: quantityPerPage, after, userId: loggedUserId } });

      if (result.error) {
        setIsLoading(false);
        return;
      }

      newCursors[page] = result.data.orders.pageInfo.endCursor;
      if (page === activePage) setOrdersResponse(result.data.orders);
    }

    setCursors(newCursors);
    setIsLoading(false);
  };

  const handlePaginationOnChange = (pageNumber: number) => setActivePage(pageNumber - 1);

  const downloadInvoice = (orderID: string) => {
    const key = `users/${loggedUserId}/invoices/${orderID}.pdf`;
    const fileName = `Faktura za zamówienie: ${orderID}`;

    fetchFileOnLocalFileSystem(key, fileName);
  };

  useEffect(() => {
    setIsLoading(true);
    processFetchingOrders();
  }, [activePage, loggedUserId]);

  const orders: Order[] = ((ordersResponse as GetOrdersResponse['orders'])?.edges ?? []).map((edge: { node: Order }) => edge.node as Order);
  const totalCount = ordersResponse?.totalCount ?? 0;

  return (
    <div className={blockName}>
        <h1 className={`${blockName}__header`}>Historia zamówień</h1>
        <table className={`${blockName}__table`}>
              <thead>
                <tr className={`${blockName}__table-row`}>
                  <td className={`${blockName}__table-col ${blockName}__table-col--thead`}>
                    Numer zamówienia
                    <div
                      className={`${blockName}__tooltip-wrapper`}
                      onMouseEnter={() => setDownloadInvoiceTooltipOpen(true)}
                      onMouseLeave={() => setDownloadInvoiceTooltipOpen(false)}
                    >
                      <Tooltip
                        open={downloadInvoiceTooltipOpen}
                        headerText="Pobierz fakturę!"
                      >
                        <LiveHelpIcon className={`${blockName}__tooltip-prompt`} />
                      </Tooltip>
                    </div>
                  </td>
                  <td className={`${blockName}__table-col ${blockName}__table-col--thead`}>Cena całkowita</td>
                  <td className={`${blockName}__table-col ${blockName}__table-col--thead`}>Data zakupu</td>
                </tr>
              </thead>
              <tbody>
                {
                  orders.map(({ id, totalPrice, createdAt }) => (
                    <tr key={id} className={`${blockName}__table-row`}>
                      <td
                        className={`${blockName}__table-col
                                    ${blockName}__table-col--invoice-download`}
                        onClick={() => downloadInvoice(id)}
                      >
                        {id}
                      </td>
                      <td className={`${blockName}__table-col`}>{totalPrice} zł</td>
                      <td className={`${blockName}__table-col`}>{formatTimestamp(createdAt)}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <Pagination
              activePage={activePage}
              onChange={handlePaginationOnChange}
              itemsQuantity={totalCount}
              quantityPerPage={quantityPerPage}
            />
        <LoadingModal
          isOpen={isLoading}
          info="Trwa pobieranie historii twoich zamówień"
        />
        <ErrorModal
          isOpen={fetchingOrdersError}
          handleOnClose={() => setFetchingOrdersError(false)}
          info="Niestety nie udało się pobrać historii twoich zamówień."
        />
    </div>
  );
};

export default History;
