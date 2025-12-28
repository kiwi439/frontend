import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'types/store';
import { useQuery } from '@apollo/client';
import { GetOrdersResponse } from 'types/orders';
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
  const [downloadInvoiceTooltipOpen, setDownloadInvoiceTooltipOpen] = useState(false);
  const [fetchingOrdersError, setFetchingOrdersError] = useState(false);

  const { loading, data } = useQuery<GetOrdersResponse>(
    GET_ORDERS,
    {
      variables: { input: { userId: loggedUserId, pagination: { page: activePage, quantityPerPage } } },
      fetchPolicy: 'network-only',
      onError: () => setFetchingOrdersError(true)
    }
  );

  const handlePaginationOnChange = (pageNumber: number) => setActivePage(pageNumber - 1);

  const downloadInvoice = (orderID: string) => {
    const key = `users/${loggedUserId}/invoices/${orderID}.pdf`;
    const fileName = `Faktura za zamówienie: ${orderID}`;

    fetchFileOnLocalFileSystem(key, fileName);
  };

  return (
    <div className={blockName}>
      <h1 className={`${blockName}__header`}>Historia zamówień</h1>
      {
        data && (
          <Fragment>
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
                  data.orders.orders.map(({ id, totalPrice, createdAt }) => (
                    <tr className={`${blockName}__table-row`}>
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
              itemsQuantity={data.orders.totalCount}
              quantityPerPage={quantityPerPage}
            />
          </Fragment>
        )
      }
      <LoadingModal
        isOpen={loading}
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
