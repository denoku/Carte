import React, { useState, useEffect, useCallback } from 'react';
import ingredientsService from '../../services/ingredientsService';
import debug from 'sabio-debug';
import { Link } from 'react-router-dom';
import RenderIngredients from './RenderIngredients';
import locale from 'rc-pagination/lib/locale/en_US';
import 'rc-pagination/assets/index.css';
import Pagination from 'rc-pagination';
import Swal from 'sweetalert2';
import { Form } from "react-bootstrap";
import { getTypes } from '../../services/lookUpService';
import toastr from 'toastr';
import './ingredients.css';
import IngredientsModal from './IngredientsModal';
import { Typeahead } from "react-bootstrap-typeahead";
import { MdAdd, MdDriveFolderUpload, MdOutlineFilterList } from 'react-icons/md';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';


const _logger = debug.extend('Ingredients');
const searchSchema = Yup.object().shape({
    query: Yup.string()
});

function Ingredients() {
    const [data, setData] = useState({
        arrayOfIngredients: [],
        mappedIngredients: [],
        pageIndex: 0,
        pageSize: 8,
        totalCount: 0,
        initialIndex: 0
    });

    const [showModal, setShowModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false)
    const [ingredientViewed, setIngredientViewed] = useState({});
    const [searchIngredients] = useState({
        query: ""
    });
    const [restriction] = useState([]);
    const [foodWarning] = useState([]);
    const [optionData, setOptionData] = useState({
        restrictionArray: [],
        foodWarningArray: []
    })

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const toggleFilter = () => {
        setShowFilters(!showFilters);
    };

    const onModalClicked = (ingredient) => {
        setIngredientViewed(ingredient);
        toggleModal();
    };

    useEffect(() => {
        ingredientsService
            .paginateByOrgId(data.pageIndex, data.pageSize)
            .then(onGetSuccess)
            .catch(onGetError);
    }, [data.pageIndex, showFilters === false]);


    const onIngredientSearch = (value) => {
        _logger('value', value.query.length);
        if (value.query.length) {
            ingredientsService
                .searchPaginateByOrgId(data.pageIndex, data.pageSize, value.query)
                .then(searchIngredientSuccess)
                .catch(searchIngredientError);
        } else {
            ingredientsService
                .paginateByOrgId(data.pageIndex, data.pageSize)
                .then(onGetSuccess)
                .catch(onGetError);
        }
    };

    const searchIngredientSuccess = (data) => {
        _logger('search ingredients success', data)

        setData((prevState) => {
            const srchdIngredients = { ...prevState };
            srchdIngredients.arrayOfIngredients = data.item.pagedItems;
            srchdIngredients.mappedIngredients = data.item.pagedItems.map(mapIngredients);
            srchdIngredients.totalCount = data.item.totalCount;
            srchdIngredients.pageIndex = data.item.pageIndex;
            srchdIngredients.pageSize = data.item.pageSize;

            return srchdIngredients;
        });

    };

    const searchIngredientError = (data) => {
        _logger('search error', data)
        toastr.error('Search Unsuccessful, please change search input and try again')
    }

    const onGetSuccess = (data) => {
        _logger('onGetSuccess', data);
        const arrIngredients = data.item.pagedItems;

        setData((prev) => {
            const pd = { ...prev };
            pd.arrayOfIngredients = arrIngredients;
            pd.mappedIngredients = arrIngredients.map(mapIngredients);
            pd.pageIndex = data.item.pageIndex;
            pd.totalCount = data.item.totalCount;
            pd.pageSize = data.item.pageSize;
            return pd;
        });
    };

    const onGetError = (error) => {
        Swal.fire('Unable to retrieve ingredients', error);
        _logger(error);
    };

    const onDeleteClicked = useCallback((createdBy, eObj) => {
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
                onIngredientClicked={onDeleteClicked}
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
        setData((prevState) => {
            const newPage = { ...prevState };

            newPage.pageIndex = page - 1;

            return newPage;
        });
    };

    useEffect(() => {
        getTypes(['PurchaseRestrictions', 'FoodWarningTypes']).then(onGetTypeSuccess).catch(onGetTypesError);
    }, []);

    const onGetTypeSuccess = (data) => {
        var restrictionInfo = data.item.purchaseRestrictions;
        var foodWarningInfo = data.item.foodWarningTypes;
        _logger('restrictionInfo', restrictionInfo);
        _logger('foodWarning', foodWarningInfo);
        setOptionData((prev) => {
            const pd = { ...prev }
            pd.restrictionArray = restrictionInfo;
            pd.foodWarningArray = foodWarningInfo;

            return pd;
        });

    };

    const onGetTypesError = (err) => {
        _logger(err);
    };

    const filterFoodWarning = (fwt) => {
        let id = fwt.map(fwt => fwt.id)
        _logger("fwt", id)
        ingredientsService
            .filterByFoodWarning(data.pageIndex, data.pageSize, id)
            .then(filterSuccess)
            .catch(filterError)
    };

    const filterSuccess = (data) => {

        const arrIngredients = data.item.pagedItems;

        setData((prev) => {
            const pd = { ...prev };
            pd.arrayOfIngredients = arrIngredients;
            pd.mappedIngredients = arrIngredients.map(mapIngredients);
            pd.pageIndex = data.item.pageIndex;
            pd.totalCount = data.item.totalCount;
            pd.pageSize = data.item.pageSize;
            return pd;
        });
    }

    const filterError = (err) => {
        _logger(err);
        toastr.error('Ingredient not found', 'An ingredient with this type does not exist')
    };

    const filterRestriction = (rt) => {
        let id = rt.map(rt => rt.id)
        _logger("rt", id)
        ingredientsService
            .filterByRestriction(data.pageIndex, data.pageSize, id)
            .then(filterSuccess)
            .catch(filterError)
    };

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
                        <Link to="/ingredient/add" className="btn btn-primary mx-2 btn-md">
                            <MdAdd />
                        </Link>

                        <Link to="/ingredient/upload" className="btn btn-primary mx-2 btn-md">
                            <MdDriveFolderUpload />
                        </Link>
                        <button onClick={toggleFilter} className='btn btn-primary mx-2 btn-md'><MdOutlineFilterList /></button>
                    </div>
                    <div className="col">   {
                        <Pagination
                            className='justify-content-center d-flex'
                            onChange={onPageChange}
                            current={data.pageIndex + 1}
                            total={data.totalCount}
                            pageSize={data.pageSize}
                            locale={locale}
                        />
                    }
                    </div>
                    <div className="col">
                        <Formik
                            enableReintialize={true}
                            initialValues={searchIngredients}
                            onSubmit={onIngredientSearch}
                            validationSchema={searchSchema}>
                            {({ submitForm, handleChange }) => (
                                <Form id="ingredients search mx-2">
                                    <div className="form-group ingredientSearchBar">
                                        <Field
                                            type="search"
                                            className="form-control"
                                            name="query"
                                            placeholder="Search..."
                                            onChange={(e) => {
                                                const target = e.target;
                                                const value = target.value;
                                                _logger('formik on change values', value);
                                                if (value.length === 0) {
                                                    submitForm();
                                                }
                                                handleChange(e);
                                            }}
                                        />
                                        <ErrorMessage className="has-error" name="query" component="div" />
                                        <button type="submit" className="btn btn-primary d-flex">
                                            Search
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        {showFilters &&
                            <Form.Group>
                                <Typeahead
                                    id="foodWarning-type"
                                    labelKey={(rt) => `${rt.name}`}
                                    onChange={filterFoodWarning}
                                    options={optionData.foodWarningArray}
                                    placeholder="Filter by Food Warning Type..."
                                    selected={foodWarning}
                                />
                            </Form.Group>
                        }
                    </div>
                    <div className="col-3">
                        {showFilters &&
                            <Form.Group>
                                <Typeahead
                                    id="restriction-type"
                                    labelKey={(rt) => `${rt.name}`}
                                    onChange={filterRestriction}
                                    options={optionData.restrictionArray}
                                    placeholder="Filter by Restriction Type..."
                                    selected={restriction}
                                />
                            </Form.Group>
                        }
                    </div>

                </div>

                <div className="row row-cols-1 row-cols-md-4 g-4 h-100 mt-1">{data.mappedIngredients}</div>
            </div>
        </React.Fragment>
    );
}
export default Ingredients;