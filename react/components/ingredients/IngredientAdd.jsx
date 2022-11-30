import React, { useState, useEffect } from 'react';
import { Col, Row, Card } from 'react-bootstrap';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ingredientsSchema from '../../schemas/ingredientsSchema';
import ingredientsService from '../../services/ingredientsService';
import Swal from 'sweetalert2';
import { useFormik, FormikProvider, Field, Form, ErrorMessage } from 'formik';
import debug from 'sabio-debug';
import { getTypes } from '../../services/lookUpService';
import FileUploaderContainer from '../FileUploaderContainer';
import './ingredients.css';
import Select from 'react-select';

const _logger = debug.extend('IngredientAdd');

const IngredientAdd = () => {
    const [restrictions, setRestrictions] = useState([]);
    const [foodWarning, setFoodWarning] = useState([]);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        restrictionId: 0,
        foodWarningTypeId: [],
        name: '',
        unitCost: '',
        description: '',
        imageUrl: '',
        isInStock: false,
        isDeleted: false,
        quantity: '',
        measure: '',
    });

    const { state } = useLocation();
    _logger('state', state)
    useEffect(() => {
        if (state?.type === 'Edit_Ingredient') {
            _logger('state', state);
            setForm((prevState) => {
                const pd = { ...prevState };
                pd.restrictionId = state.payload.restriction.id
                pd.foodWarningTypeId = state?.payload?.foodWarningTypes?.map(fwt => ({ label: fwt.name, value: fwt.id }))
                pd.name = state.payload.name
                pd.unitCost = state.payload.unitCost
                pd.description = state.payload.description
                pd.imageUrl = state.payload.imageUrl
                pd.isInStock = state.payload.isInStock
                pd.isDeleted = state.payload.isDeleted
                pd.quantity = state.payload.quantity
                pd.measure = state.payload.measure
                return pd
            })
        }
        if (state === null) {
            setForm((prevState) => {
                const pd = { ...prevState };
                pd.restrictionId = 0
                pd.foodWarningTypeId = []
                pd.name = ''
                pd.unitCost = ''
                pd.description = ''
                pd.imageUrl = ''
                pd.isInStock = false
                pd.isDeleted = false
                pd.quantity = ''
                pd.measure = ''
                return pd
            })
        }
    }, [state]);

    const handleSubmitClicked = (values) => {
        _logger('Add/Edit clicked', values);
        if (state?.type === 'Edit_Ingredient') {
            let payload = values;
            payload.id = state.payload.id;
            payload.foodWarningTypeId = payload.foodWarningTypeId.map(id => parseInt(id.value));
            ingredientsService.ingredientUpdate(payload, payload.id).then(onEditSuccess).catch(onEditError);
            _logger('update button worked');
        } else {
            let payload = values;
            payload.restrictionId = parseInt(values.restrictionId);
            payload.foodWarningTypeId = payload.foodWarningTypeId.map(id => parseInt(id.value));;
            ingredientsService.add(payload).then(onRegSuccess).catch(onRegError);
            _logger('Add button worked');
        }
    };
    const onRegSuccess = (response) => {
        _logger(response);
        Swal.fire('Ingredient Added.', response);
        navigate('/ingredients');
    };
    const onRegError = (error) => {
        _logger(error);

        Swal.fire('Ingredient not added', error);
    };

    const onEditSuccess = (response) => {
        _logger(response);
        Swal.fire('Edit successful.', response);
        navigate('/ingredients');
    };
    const onEditError = (error) => {
        _logger(error);

        Swal.fire('Could not edit Ingredient, please try again', error);
    };

    useEffect(() => {
        getTypes(['PurchaseRestrictions', 'FoodWarningTypes']).then(onGetTypeSuccess).catch(onGetTypesError);
    }, []);

    const onGetTypeSuccess = (data) => {
        var restrictionInfo = data.item.purchaseRestrictions;
        var foodWarningInfo = data.item.foodWarningTypes;
        _logger('restrictionInfo', restrictionInfo);
        _logger('foodWarning', foodWarningInfo);

        const mappedRestrictions = restrictionInfo.map(mapLookUpTables);
        _logger('mr', mappedRestrictions);
        const mappedFoodWarning = foodWarningInfo.map(mapFoodWarning);
        _logger('mf', mappedFoodWarning);
        setRestrictions(mappedRestrictions);
        setFoodWarning(mappedFoodWarning);
    };

    const onGetTypesError = (err) => {
        _logger(err);
    };

    const mapLookUpTables = (lookUpType) => {
        _logger('look up type', lookUpType.name);
        return (
            <option value={lookUpType.id} key={lookUpType.id}>
                {lookUpType.name}
            </option>
        );
    };

    const mapFoodWarning = (options) => {
        const selectOptions = {
            value: options.id,
            label: options.name,
        };
        _logger('options', selectOptions);
        return selectOptions;
    };
    const onFileUpload = (files) => {
        formik.setFieldValue('imageUrl', files[0].url);
    };

    const GoBack = () => {
        navigate(`/ingredient`);
    };
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: form,
        onSubmit: handleSubmitClicked,
        validationSchema: ingredientsSchema,
    });

    return (
        <>
            <Row>
                <Col lg={6}>
                    <Card>
                        <Card.Body>
                            <FormikProvider value={formik}>
                                <h2>{state ? 'Edit Ingredient' : 'Add Ingredient'}</h2>

                                <Form>
                                    <div className="mb-3">
                                        <label>Name of Ingredient</label>
                                        <Field
                                            required
                                            type="text"
                                            id="ingredientName"
                                            name="name"
                                            className="form-control"
                                            placeholder="Onion"
                                        />
                                        <ErrorMessage name="name" component={'div'} className="ingredient-error" />
                                    </div>

                                    <div className="mb-3">
                                        <label>Price per unit</label>
                                        <Field
                                            required
                                            type="number"
                                            id="unitCost"
                                            name="unitCost"
                                            className="form-control"
                                            placeholder="2.00"
                                        />
                                        <ErrorMessage name="unitCost" component={'div'} className="ingredient-error" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Measure</label>
                                        <Field
                                            required
                                            type="text"
                                            id="measure"
                                            name="measure"
                                            className="form-control"
                                            placeholder="Pounds, Ounces, liters, Gallons, TableSpoon, Teaspoon, Cup"
                                        />
                                        <ErrorMessage name="measure" component={'div'} className="ingredient-error" />
                                    </div>
                                    <div className="mb-3">
                                        <label>Quantity</label>
                                        <Field
                                            required
                                            type="text"
                                            id="quantity"
                                            name="quantity"
                                            className="form-control"
                                            placeholder="Quantity of Ingredient"
                                        />
                                        <ErrorMessage name="quantity" component={'div'} className="ingredient-error" />
                                    </div>

                                    <label className="mb-1 mt23 fw-bold">Restrictions</label>
                                    <Field component="select" name="restrictionId" className="form-control">
                                        <option>Please Select Restriction</option>
                                        {restrictions}
                                    </Field>
                                    <label className="mb-1 mt-3 fw-bold ">Food Warnings</label>
                                    <Select
                                        isMulti
                                        name="foodWarningTypeId"
                                        className="basic-multi-select"
                                        value={formik.values.foodWarningTypeId}
                                        onChange={(selectedOption) =>
                                            formik.setFieldValue('foodWarningTypeId', selectedOption)
                                        }
                                        options={foodWarning}
                                        closeMenuOnSelect={true}>

                                    </Select>
                                    <div className="mb-3 mt-3">
                                        <label>Description</label>
                                        <Field
                                            required
                                            component="textarea"
                                            id="description"
                                            name="description"
                                            className="form-control ingredientAddDescription"
                                            placeholder="Description of ingredient"
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component={'div'}
                                            className="ingredient-error"
                                        />
                                    </div>
                                    <div className="checkbox-wrapper">
                                        <div>
                                            <label>In Stock? &nbsp;</label>
                                            <Field
                                                type="checkbox"
                                                id="isInStock"
                                                name="isInStock"
                                                placeholder="Is In Stock"
                                            />
                                            <ErrorMessage
                                                name="isInStock"
                                                component={'div'}
                                                className="ingredient-error"
                                            />
                                        </div>
                                        <p></p>
                                        <Row>
                                            <Col>
                                                <FileUploaderContainer
                                                    onHandleUploadSuccess={(files) => onFileUpload(files)}
                                                />
                                                <Field
                                                    name="imageUrl"
                                                    className="form-control mt-1"
                                                    disable={false ? 'false' : undefined}
                                                    placeholder="Enter Image URL here"></Field>{' '}
                                            </Col>
                                        </Row>
                                    </div>
                                    <p></p>
                                    <button to="/ingredients" className="btn btn-success" type="submit">
                                        {state ? 'Edit Ingredient' : 'Add Ingredient'}
                                    </button>
                                    <p></p>
                                    <div>
                                        <Link to="/ingredients" className="btn btn-success" onClick={GoBack}>
                                            Go Back <i className="mdi mdi-arrow-right ms-1"></i>
                                        </Link>
                                    </div>
                                </Form>
                            </FormikProvider>
                        </Card.Body>
                    </Card>
                </Col>
                {state !== null}
                <Col className="addIngredient-preview">
                    <div className="col">
                        <div className="col">
                            <Card style={{ width: '25rem' }}>
                                <Card.Img variant="top" src={formik.values.imageUrl} alt="CARD PREVIEW" />
                                <Card.Body>
                                    <Card.Title className="text-center">
                                        <strong>{formik.values.name}</strong>
                                    </Card.Title>
                                    <Card.Text>
                                        <b>Description:</b> {formik.values.description}
                                    </Card.Text>
                                    <Card.Text>
                                        <b>Cost per {formik.values.measure?.toLowerCase()}: </b> $
                                        {formik.values.unitCost}
                                    </Card.Text>
                                    <Card.Text>
                                        <b>Quantity:</b> {formik.values.quantity}{' '}
                                    </Card.Text>
                                    <Card.Text>
                                        <b>FoodWarning:</b>{' '}
                                        {formik.values.foodWarningTypeId?.map((name) => name.label).join()}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default IngredientAdd;
