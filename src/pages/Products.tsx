import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Categories } from 'types/category';
import { GetProductsResponse } from 'types/product';
import useScrollIntoElement from 'hooks/useScrollIntoElement';
import { GET_PRODUCTS } from 'graphql/queries/products';
import { generateHeaderCaption } from 'services/products';
import LoadingModal from 'components/modals/LoadingModal';
import ErrorModal from 'components/modals/ErrorModal';
import Product from 'components/product/Product';
import Pagination from 'components/Pagination';

type ProductsProps = { arePromoted?: boolean };

const Products = ({ arePromoted = false }: ProductsProps) => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const blockName = 'products';
  const quantityPerPage = 5;
  const productType = searchParams.get('type') as Categories | null;
  const headerCaption = generateHeaderCaption(arePromoted, productType);
  const [activePage, setActivePage] = useState(0);
  const [fetchingProductError, setFetchingProductError] = useState(false);
  const { loading, error, data } = useQuery<GetProductsResponse>(
    GET_PRODUCTS,
    {
      variables: {
        input: { promoted: arePromoted, type: productType, pagination: { page: activePage, quantityPerPage } }
      }
    }
  );

  const handlePaginationOnChange = (pageNumber: number) => setActivePage(pageNumber - 1);

  useScrollIntoElement({ scrollDependency: location.key, elementSelector: `.${blockName}__header` });
  useEffect(() => { if (error) { setFetchingProductError(true); } }, [error]);

  let content;

  if (loading) {
    content = <LoadingModal isOpen={loading} info="Trwa pobieranie produktów!" />;
  } else if (error) {
    content = <ErrorModal isOpen={fetchingProductError} handleOnClose={() => setFetchingProductError(false)} info="Nie udało się pobrać listy produktów" />;
  } else {
    const { productsDetails: { totalCount, products } } = data!;

    content = (
      <>
        <div className={`${blockName}__list`}>
          {
            products.map((product, index) => (
              <Product
                product={product}
                key={product.id}
                index={index}
                mode="main"
              />
            ))
          }
        </div>
        <Pagination
          activePage={activePage}
          onChange={handlePaginationOnChange}
          itemsQuantity={totalCount}
          quantityPerPage={quantityPerPage}
        />
      </>
    );
  }

  return (
    <div className={`main__${blockName} ${blockName}`}>
      <h2 className={`${blockName}__header`}>
        {headerCaption}
      </h2>
      {content}
    </div>
  );
};

export default Products;
