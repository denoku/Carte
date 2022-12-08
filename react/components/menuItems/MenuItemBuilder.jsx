import React from 'react';
import { useState, useEffect } from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import menuItemSchema from '../../schemas/menuItemsSchema';
import { Container, Card, Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import logger from 'sabio-debug';
import menuItemsService from '../../services/menuItemsService';
import toastr from 'toastr';
import Swal from 'sweetalert2';
import AllMenuItemsMultiSelect from './AllMenuItemsMultiSelect';
import OrderStatusDropdown from './OrderStatusDropdown';
import FileUploaderContainer from '../../components/FileUploaderContainer';
import FoodSafeTypesMultiSelect from './FoodSafeTypesMultiSelect';
import TagsMultiSelect from './TagsMultiSelect';
import IngredientsMultiSelect from './IngredientsMultiSelect';
import RenderImage from './RenderImage';
import PropTypes from 'prop-types';
import orgServices from '../../services/organizationService';
import { getMenus } from '../../services/menusService';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'toastr/build/toastr.min.css';
import './menuitems.css';


const _logger = logger.extend('MenuItemBuilder');

function MenuItemBuilder(props) {
    const currentUserId = props.currentUser.id;
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({
        id: '',
        organization: '',
        menuId: 0,
        orderStatus: 1,
        unitCost: '',
        name: '',
        description: '',
        imageUrl: '',
        menuFoodSafeType: 0,
        tags: 0,
        menuIngredients: 0,
    });
    const [showAltIngred, setShowAltIngred] = useState(false);
    const [menuData, setMenuData] = useState([]);

    useEffect(() => {
        orgServices.getOrgByUserId(currentUserId).then(onGetOrgByUserSuccess).catch(onGetOrgByUserError);
    }, []);

    const onGetOrgByUserSuccess = (data) => {
        var organizationId = data.item.id;
        setFormData((prevState) => {
            const pd = { ...prevState };
            pd.organization = organizationId;
            return pd;
        });
    };

    const onGetOrgByUserError = (err) => {
        _logger(err, 'Tag load error');
    };

    useEffect(() => {
        if (location.state?.type === 'UPDATE_MENUITEM') {
            setFormData({
                ...location.state.payload,
            });
            setShowAltIngred(true);
        }
    }, [location]);
    const onPostMenuItemSuccess = (data) => {
        Swal.fire({
            icon: 'success',
            title: `You have successfully created Menu Item ${data.item}`,
            timer: 3000,
            timerProgressBar: true,
        });
        navigate(`/menus`);
    };
    const onPostError = () => {
        toastr.error('Wrong information. Please Try again.');
    };
    const onPutMenuItemSuccess = () => {
        Swal.fire({
            icon: 'success',
            title: `You have successfully updated a Menu Item`,
            timer: 3000,
            timerProgressBar: true,
        });
        navigate(`/menuitem`);
    };
    const onPutError = () => {
        _logger('onPutError');
        toastr.error('Wrong information. Please Try again.');
    };
    const onFileUpload = (files, setFieldValue) => {
        setFieldValue('imageUrl', files[0].url);
    };
    const onBackClicked = () => {
        navigate(`/menuitem`);
    };
    const handleSubmit = (values, { resetForm }) => {
        _logger('handleSubmit', values);
        let getFoodSafeTypes = (values) => {
            if (values.menuFoodSafeType) {
                let item = values.menuFoodSafeType?.map(mapItems);
                return item;
            }
        };
        let getTags = (values) => {
            if (values.tags) {
                let item = values.tags?.map(mapItems);
                return item;
            }
        };
        let getMenuIngredients = (values) => {
            if (values.menuIngredients) {
                let item = values.menuIngredients?.map(mapItems);
                return item;
            }
        };
        let payloadToAdd = {
            organizationId: formData.organization,
            menuId: values.menuId,
            orderStatusId: parseInt(values.orderStatus),
            unitCost: parseFloat(values.unitCost),
            name: values.name,
            description: values?.description,
            imageUrl: values?.imageUrl,
            menuFoodSafeTypes: getFoodSafeTypes(values),
            tagIds: getTags(values),
            menuIngredients: getMenuIngredients(values),
        };
        _logger('payload', payloadToAdd)

        let payloadToUpdate = payloadToAdd;
        payloadToAdd.id = values.id;

        if (values.id === '' || !values.id) {
            menuItemsService.AddAllItems(payloadToAdd).then(onPostMenuItemSuccess).catch(onPostError);
            resetForm({});
        } else {
            menuItemsService.UpdateAllItems(payloadToUpdate).then(onPutMenuItemSuccess).catch(onPutError);
            resetForm({});
        }
    };
    const mapItems = (mappedTypes) => {
        return mappedTypes.id;
    };

    const onEditAltIngreds = () => {
        if (location?.state) {
            navigate('/menus/items/ingredients/alternates', { state: location.state });
        } else {
            navigate('/menus/items/ingredients/alternates');
        }
    };

    useEffect(() => {
        getMenus(1).then(onGetMenusSuccess).catch(onGetMenusError);
    }, [])

    const onGetMenusSuccess = (data) => {
        _logger('getMenusSuccess', { data });
        var menuInfo = data.items;
        _logger('menuInfo', menuInfo);
        const mappedMenuItems = menuInfo.map(mapLookUpTables);
        _logger('mf', mappedMenuItems);
        setMenuData(mappedMenuItems);
    };

    const mapLookUpTables = (lookUpType) => {
        _logger('look up type', lookUpType.name);
        return (
            <option value={lookUpType.id} key={lookUpType.id}>
                {lookUpType.name}
            </option>
        );
    };

    const onGetMenusError = (err) => {
        _logger('getMenuserr', err);
    };
    return (
        <React.Fragment>
            <Container>
                <Formik
                    enableReinitialize={true}
                    initialValues={formData}
                    onSubmit={handleSubmit}
                    validationSchema={menuItemSchema}>
                    {({ setFieldValue }) => (
                        <Card>
                            <Row>
                                <Col>
                                    <Card.Body>
                                        <Row>
                                            <Col>
                                                <h2 className="header-title">Add or Update a Menu Item!</h2>
                                            </Col>
                                            <Col>
                                                <button
                                                    className=" btn btn-primary menu-item-card-button"
                                                    onClick={onBackClicked}>
                                                    Your Menu Items
                                                </button>
                                            </Col>
                                            {showAltIngred && (
                                                <>
                                                    <Col>
                                                        <button
                                                            className="btn btn-primary menu-item-card-button"
                                                            onClick={onEditAltIngreds}>
                                                            Add Alternate Ingredients
                                                        </button>
                                                    </Col>{' '}
                                                </>
                                            )}
                                        </Row>
                                        <p></p>
                                        <Form>
                                            <Col>
                                                <div className="Col-6">
                                                    <p></p>
                                                    <Row>
                                                        <AllMenuItemsMultiSelect
                                                            organizationId={formData.organization}
                                                        />
                                                    </Row>
                                                    <p></p>
                                                    <Row>
                                                        <OrderStatusDropdown />
                                                    </Row>
                                                    <p></p>
                                                    <Row>
                                                        <label className="menu-item-form-label">Unit Cost</label>
                                                        <Field
                                                            type="text"
                                                            name="unitCost"
                                                            id="unitCost"
                                                            placeholder="$"
                                                            className="form-control menu-item-form-input"
                                                        />
                                                        <ErrorMessage
                                                            name="unitCost"
                                                            component="div"
                                                            className="has-error menu-item-error-message"
                                                        />
                                                    </Row>
                                                    <p></p>
                                                    <Row>
                                                        <label>Name</label>
                                                        <Field
                                                            type="text"
                                                            name="name"
                                                            id="name"
                                                            placeholder="..."
                                                            className="form-control menu-item-form-input"
                                                        />
                                                        <ErrorMessage
                                                            name="name"
                                                            component="div"
                                                            className="has-error menu-item-error-message"
                                                        />
                                                    </Row>
                                                    <p></p>
                                                    <div className="form-group">
                                                        <label>Description</label>
                                                        <Field
                                                            component="textarea"
                                                            label="Text Area"
                                                            type="textarea"
                                                            name="description"
                                                            rows="6"
                                                            placeholder="A tasty menu item."
                                                            className="form-control"
                                                            key="textarea"
                                                        />
                                                    </div>
                                                    <p></p>
                                                    <Row>
                                                        <FoodSafeTypesMultiSelect
                                                            organizationId={formData.organization}
                                                        />
                                                    </Row>
                                                    <p></p>
                                                    <Row>
                                                        <TagsMultiSelect organizationId={formData.organization} />
                                                    </Row>
                                                    <p></p>
                                                    <Row>
                                                        <label >Menu Type</label>
                                                        <Field component="select" name="menuId" className="form-control mx-2">
                                                            <option>Please Select Menu</option>
                                                            {menuData}
                                                        </Field>

                                                        <RenderImage />
                                                        <label>Upload Image File</label>
                                                        <div name="imageUrl">
                                                            <FileUploaderContainer
                                                                onHandleUploadSuccess={(files) =>
                                                                    onFileUpload(files, setFieldValue)
                                                                }
                                                            />
                                                        </div>
                                                    </Row>
                                                    <p></p>
                                                    <Row sm={6}>
                                                        <button
                                                            type="onSubmit"
                                                            className="btn btn-primary menu-item-form-button">
                                                            Submit
                                                        </button>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Form>
                                    </Card.Body>
                                </Col>
                                <Col>
                                    <Card.Body>
                                        <div className="Col-6">
                                            <Row className="menu-item-row">
                                                <IngredientsMultiSelect organizationId={formData.organization} />
                                            </Row>
                                        </div>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    )}
                </Formik>
            </Container>
        </React.Fragment>
    );
}
MenuItemBuilder.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }),
};
export default React.memo(MenuItemBuilder);
