import React, { useState, useEffect, useCallback } from 'react';
import ingredientsService from '../../services/ingredientsService';
import debug from 'sabio-debug';
import { Link } from 'react-router-dom';
import RenderIngredients from './RenderIngredients';
import locale from 'rc-pagination/lib/locale/en_US';
import 'rc-pagination/assets/index.css';
import Pagination from 'rc-pagination';
import Swal from 'sweetalert2';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toastr from 'toastr';
import './ingredients.css';
import IngredientsModal from './IngredientsModal'

const _logger = debug.extend('Ingredients');
const searchSchema = Yup.object().shape({
    query: Yup.string(),
});

function Ingredients() {
    const [data, setData] = useState({ arrayOfIngredients: [], mappedIngredients: [] });
    const [id] = useState(0);

    const [pagination, setCurrentPage] = useState({
        pageIndex: 0,
        pageSize: 8,
        totalCount: 0,
    });

    const [showModal, setShowModal] = useState(false);
    const [ingredientViewed, setIngredientViewed] = useState({});
    const [searchIngredients, setSearchIngredients] = useState({
        query: ""
    });

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const onModalClicked = (ingredient) => {
        setIngredientViewed(ingredient);
        toggleModal();
    }

    _logger(setSearchIngredients);
    const onIngredientSearch = (value) => {
        _logger('value', value)
        ingredientsService
            .searchPaginateByCreatedBy(0, 5, id, value.query)
            .then(searchIngSuccess)
            .catch(searchIngError)
    };

    const searchIngSuccess = (data) => {
        _logger('search ingredients success', data)
        setData((prevState) => {
            const srchdIngredients = { ...prevState };
            srchdIngredients.arrayOfIngredients = data.item.pagedItems;
            srchdIngredients.mappedIngredients = data.item.pagedItems.map(mapIngredients);

            return srchdIngredients;
        });
        setCurrentPage((prevState) => {
            const newPage = { ...prevState };
            newPage.totalCount = data.item.totalCount;
            newPage.pageIndex = data.item.pageIndex;
            newPage.pageSize = data.item.pageSize;
            return newPage;
        });
    };

    const searchIngError = (data) => {
        _logger('search error', data)
        toastr.error('Search Unsuccessful, please change field and try again')
    }

    const onGetSuccess = (data) => {
        _logger('onGetSuccess', data);
        const arrIngredients = data.item.pagedItems;

        setData((prev) => {
            const pd = { ...prev };
            pd.arrayOfIngredients = arrIngredients;
            pd.mappedIngredients = arrIngredients.map(mapIngredients);
            return pd;
        });
        setCurrentPage((prevState) => {
            const newPage = { ...prevState };
            newPage.totalCount = data.item.totalCount;
            newPage.pageIndex = data.item.pageIndex;
            newPage.pageSize = data.item.pageSize;
            return newPage;
        });
    };

    const onGetError = (error) => {
        Swal.fire('Unable to retrieve ingredients', error);
        _logger(error);
    };

    const onClick = useCallback((createdBy, eObj) => {
        _logger('deleteById', { createdBy, eObj });
        const handler = deleteSuccessHandler(createdBy.id);
        ingredientsService.ingredientDeleteById(createdBy.id).then(handler).catch(onDeleteError);
    }, []);

    const mapIngredients = (aIngredient) => {
        _logger(aIngredient);
        return (
            <RenderIngredients
                ingredient={aIngredient}
                key={aIngredient.id}
                onIngredientClicked={onClick}
                onModal={onModalClicked} />
        );
    };

    const deleteSuccessHandler = (id) => {
        return () => {
            setData((prev) => {
                const stateCopy = { ...prev };
                stateCopy.arrayOfIngredients = [...stateCopy.arrayOfIngredients];

                const idxOf = stateCopy.arrayOfIngredients.findIndex((ingredient) => {
                    _logger(ingredient);
                    let result = false;
                    if (ingredient.id === id) {
                        result = true;
                    }
                    return result;
                });

                if (idxOf >= 0) {
                    stateCopy.arrayOfIngredients.splice(idxOf, 1);
                    stateCopy.mappedIngredients = stateCopy.arrayOfIngredients.map(mapIngredients);
                }

                return stateCopy;
            });
            _logger(id);
        };
    };

    const onDeleteError = (error) => {
        Swal.fire('Opps! Ingredient was not deleted.');
        _logger(error);
    };

    const onPageChange = (page) => {
        setCurrentPage((prevState) => {
            const newPage = { ...prevState };

            newPage.pageIndex = page - 1;

            return newPage;
        });
    };

    useEffect(() => {
        ingredientsService
            .paginateByCreatedBy(pagination.pageIndex, pagination.pageSize, id)
            .then(onGetSuccess)
            .catch(onGetError);
    }, [pagination.pageIndex]);

    return (
        <React.Fragment>
            <IngredientsModal
                isOpen={showModal}
                ingredientViewed={ingredientViewed}
                toggleModal={toggleModal}
            />

            <div className="container">
                <div className="row mt-2 justify-content-between align-items-center">
                    <div className="col">
                        <h1>Ingredients</h1>
                    </div>
                </div>
                <div className="d-flex">
                    <div className="col">
                        <Link to="/ingredient/add" className="btn btn-primary mx-2 btn-sm">
                            Add Ingredient
                        </Link>

                        <Link to="/ingredient/upload" className="btn btn-primary mx-2 btn-sm">
                            Upload Ingredients
                        </Link>
                    </div>
                    <div className="col">   {
                        <Pagination
                            className='justify-content-center d-flex'
                            onChange={onPageChange}
                            current={pagination.pageIndex + 1}
                            total={pagination.totalCount}
                            pageSize={pagination.pageSize}
                            locale={locale}
                        />
                    }
                    </div>
                    <div className="col">
                        <Formik
                            enableReintialize={true}
                            initialValues={searchIngredients}
                            onSubmit={onIngredientSearch}
                            validationSchema={searchSchema}
                        >
                            <Form id='searchIngredients mx-2'>
                                <div className="form-group ingredientSearchBar">
                                    <Field type="search" className="form-control" name="query" placeholder='Search...' />
                                    <ErrorMessage className="has-error" name="query" component="div" />

                                    <button type="submit" className="btn btn-primary">
                                        Search
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>
                <div className="row row-cols-1 row-cols-md-4 g-4 h-100 mt-1">{data.mappedIngredients}</div>
            </div>
        </React.Fragment>
    );
}
export default Ingredients;