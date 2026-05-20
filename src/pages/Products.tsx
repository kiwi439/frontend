import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { Categories } from 'types/category';
import { GetProductsResponse } from 'types/product';
import { GET_PRODUCTS } from 'graphql/queries/products';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';
import Product from 'components/product/Product';
import Pagination from 'components/Pagination';

type ProductsProps = { arePromoted?: boolean };

const BLOCK_NAME = 'products';
const QUANTITY_PER_PAGE = 5;

const Products = ({ arePromoted = false }: ProductsProps) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const productType = searchParams.get('type') as Categories | null;
  const [activePage, setActivePage] = useState(0);
  const [cursors, setCursors] = useState<Map<number, string | null>>(new Map([[0, null]]));
  const [fetchingProductError, setFetchingProductError] = useState(false);
  const [fetchProducts, { loading, error, data, called }] = useLazyQuery<GetProductsResponse>(GET_PRODUCTS);

  const handlePaginationOnChange = async (pageNumber: number) => {
    const selectedPageIndex = pageNumber - 1;
    const isSkippingPages = selectedPageIndex > activePage + 1;
    const needsLoadIndirectPages = !cursors.has(selectedPageIndex);
    
    let currentCursor = cursors.get(selectedPageIndex) || null;
    
    if (isSkippingPages && needsLoadIndirectPages) {
      currentCursor = cursors.get(activePage + 1) ?? null;
      let currentPage = activePage + 1;
      
      while (currentPage < selectedPageIndex && currentCursor) {
        const pageToSave = currentPage + 1;
        const result = await fetchProducts({
          variables: {
            first: QUANTITY_PER_PAGE,
            after: currentCursor,
            promoted: arePromoted,
            type: productType
          },
          onCompleted: (data: GetProductsResponse) => {
            setCursors(prev => {
              const newCursors = new Map(prev);
              newCursors.set(pageToSave, data.products.pageInfo.endCursor);
              return newCursors;
            });
          },
          onError: () => setFetchingProductError(true)
        });
        
        currentPage++;
        currentCursor = result.data!.products.pageInfo.endCursor;
      }
    }
    
    setActivePage(selectedPageIndex);

    fetchProducts({ variables: { first: QUANTITY_PER_PAGE, after: currentCursor, promoted: arePromoted, type: productType },
      onCompleted: (data: GetProductsResponse) => {
        setCursors(prev => {
          const newCursors = new Map(prev);
          newCursors.set(selectedPageIndex + 1, data.products.pageInfo.endCursor);
          return newCursors;
        });
      },
      onError: () => setFetchingProductError(true)
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const renderLoadingModal = () => (
    <LoadingModal isOpen={loading || !called} info="Trwa pobieranie produktów!" />
  );

  const renderErrorModal = () => (
    <ErrorModal 
      isOpen={fetchingProductError} 
      handleOnClose={() => setFetchingProductError(false)} 
      body={<p>Nie udało się pobrać listy produktów</p>}
    />
  );

  const renderProducts = () => {
    const { products: { totalCount, edges } } = data!;

    return (
      <>
        <div className={`${BLOCK_NAME}__list`}>
          {edges.map((edge, index) => <Product product={edge.node} key={edge.node.id} index={index} mode="main" />)}
        </div>
        <Pagination
          activePage={activePage}
          onChange={handlePaginationOnChange}
          itemsQuantity={totalCount}
          quantityPerPage={QUANTITY_PER_PAGE}
        />
      </>
    );
  };

  const renderContent = () => {
    if (loading || !called) return renderLoadingModal();
    if (error) return renderErrorModal();

    return renderProducts();
  };

  useEffect(() => {
    scrollToTop();
  }, [location.key]);

  useEffect(() => {
    setActivePage(0);
    setCursors(new Map([[0, null]]));
    
    fetchProducts({ variables: { first: QUANTITY_PER_PAGE, after: null, promoted: arePromoted, type: productType },
      onCompleted: (data: GetProductsResponse) => {
        setCursors(prev => {
          const newCursors = new Map(prev);
          newCursors.set(1, data.products.pageInfo.endCursor);
          return newCursors;
        });
      },
      onError: () => setFetchingProductError(true)
    });
  }, [productType, arePromoted]);

  return (
    <div className={`main__${BLOCK_NAME} ${BLOCK_NAME}`}>
      {renderContent()}
    </div>
  );
};

export default Products;
