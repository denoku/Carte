import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import logger from 'sabio-debug';
import menuItemsService from '../../services/menuItemsService';
import { getMenus } from '../../services/menusService';
import { Form as Form1 } from 'react-bootstrap';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import locale from 'rc-pagination/lib/locale/en_US';
import { MdAdd, MdSearch } from 'react-icons/md';
import Select from 'react-select';
import Swal from 'sweetalert2';
import toastr from 'toastr';
import * as Yup from 'yup'
import orgServices from '../../services/organizationService';
import 'toastr/build/toastr.min.css';
import MenuItemCard from '../menuitems/MenuItemCard';

const _logger = logger.extend('Menus');
const searchSchema = Yup.object().shape({
    query: Yup.string(),
});

function Menus(props) {
    const currentUserId = props.currentUser.id;
    const [organizationData, setOrganizationData] = useState([]);
    _logger('orgData', organizationData);
    _logger('props', props);
    const [data, setData] = useState({
        arrayOfMenuItems: [],
        menuItemComponents: [],
        pageIndex: 0,
        pageSize: 8,
        totalCount: 0,
    });
    const [searchMenuItems] = useState({
        query: '',
    });
    const [menuData, setMenuData] = useState([]);
    _logger('menuData', menuData);

    const { state } = useLocation();
    //const roles = props.currentUser.roles;
    useEffect(() => {
        if (state?.type === 'ORG_DATA') {
            _logger('state', state);
            setOrganizationData(state.payload);

            if (state.payload?.id) {
                getMenus(state.payload.id).then(onGetMenusSuccess).catch(onGetMenusError);
            }
        } else {
            orgServices.getOrgByUserId(currentUserId).then(onGetOrgByUserSuccess).catch(onGetOrgByUserError);
            getMenus(1).then(onGetMenusSuccess).catch(onGetMenusError);
        }
    }, []);

    const onGetOrgByUserSuccess = (data) => {
        var orgId = data.item.id;
        _logger(orgId, '<--- OrgId coming in ');
        setOrganizationData(data.item);
    };
    const onGetOrgByUserError = (err) => {
        _logger(err, 'Tag load error');
        toastr.error(`Oops. System couldn't identify your organization`);
    };

    const getMenuItemsSuccess = (data) => {
        _logger('getMenuItemsSuccess', data.item);
        const arrMenuItems = data.item.pagedItems;

        setData((prev) => {
            const pd = { ...prev };
            pd.arrayOfMenuItems = arrMenuItems;
            pd.menuItemComponents = arrMenuItems.map(mapMenuItems);
            pd.pageIndex = data.item.pageIndex;
            pd.pageSize = data.item.pageSize;
            return pd;
        });
    };

    const getMenuItemsError = (err) => {
        _logger('onERROR', err);
        toastr.error('Oops, something went wrong when fetching your menu items.');
    };

    const onGetMenusSuccess = (data) => {
        _logger('getMenusSuccess', { data });
        var menuInfo = data.items;
        _logger('menuInfo', menuInfo);
        const mappedMenuItems = menuInfo.map(mapTypes);
        _logger('mf', mappedMenuItems);
        setMenuData(mappedMenuItems);
    };

    const mapTypes = (options) => {
        const selectOptions = {
            value: options.id,
            label: options.name,
        };
        _logger('options', selectOptions);
        return selectOptions;
    };

    const onGetMenusError = (err) => {
        _logger('getMenuserr', err);
    };
    const onMenuItemSearch = (value) => {
        _logger('value', value.query.length);
        if (value.query.length) {
            menuItemsService
                .getPagedQueryByOrgId(data.pageIndex, data.pageSize, value.query)
                .then(searchMenuItemSuccess)
                .catch(searchMenuItemError);
        } else {
            menuItemsService
                .getMenuItemsByMenuId(data.pageIndex, data.pageSize)
                .then(getMenuItemsSuccess)
                .catch(getMenuItemsError);
        }
    };
    const searchMenuItemSuccess = (data) => {
        _logger('search ingredients success', data);
        setData((prevState) => {
            const srchdMenuItems = { ...prevState };
            srchdMenuItems.arrayOfMenuItems = data.item.pagedItems;
            srchdMenuItems.menuItemComponents = data.item.pagedItems.map(mapMenuItems);
            srchdMenuItems.totalCount = data.item.totalCount;
            srchdMenuItems.pageIndex = data.item.pageIndex;
            srchdMenuItems.pageSize = data.item.pageSize;
            return srchdMenuItems;
        });
    };

    const searchMenuItemError = (data) => {
        _logger('search error', data);
        toastr.error('Search Unsuccessful, please change search input and try again');
    };

    const onDeleteClicked = useCallback((createdBy, eObj) => {
        _logger('deleteById', { createdBy, eObj });
        const handler = deleteSuccessHandler(createdBy.id);
        menuItemsService.deleteById(createdBy.id).then(handler).catch(onDeleteError);
    }, []);

    const mapMenuItems = (menuItem) => {
        _logger(menuItem)
        return (
            <MenuItemCard
                menuItem={menuItem}
                key={menuItem.id}
                onDeleteClicked={onDeleteClicked}
                currentUser={props.currentUser} />
        )
    };

    const deleteSuccessHandler = (id) => {
        return () => {
            setData((prev) => {
                const stateCopy = { ...prev };
                stateCopy.arrayOfMenuItems = [...stateCopy.arrayOfMenuItems];

                const idxOf = stateCopy.arrayOfMenuItems.findIndex((menuItem) => {
                    _logger(menuItem);
                    let result = false;
                    if (menuItem.id === id) {
                        result = true;
                    }
                    return result;
                });

                if (idxOf >= 0) {
                    stateCopy.arrayOfMenuItems.splice(idxOf, 1);
                    stateCopy.menuItemComponents = stateCopy.arrayOfMenuItems.map(mapMenuItems);
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
    const filterByMenu = (menu) => {
        _logger('menuFilter', menu.value);
        menuItemsService
            .getMenuItemsByMenuId(organizationData.id, data.pageIndex, data.pageSize, menu.value)
            .then(filterSuccess)
            .catch(filterError);
    };

    const filterSuccess = (data) => {
        const arrMenuItems = data.item.pagedItems;

        setData((prev) => {
            const pd = { ...prev };
            pd.arrayOfMenuItems = arrMenuItems;
            pd.menuItemComponents = arrMenuItems.map(mapMenuItems);
            pd.pageIndex = data.item.pageIndex;
            pd.totalCount = data.item.totalCount;
            pd.pageSize = data.item.pageSize;
            return pd;
        });
    };

    const filterError = (err) => {
        _logger(err);
        toastr.error('Menu not found', 'Please select a different Menu');
    };

    return (
        <React.Fragment>
            <div className="container">
                <div className="row mt-2 justify-content-between align-items-center">
                    <div className="col">
                        <h1>{`${organizationData.name}`}</h1>
                    </div>
                </div>
                <div className=" row d-flex">
                    <div className="col-1">

                        <>

                            <Link to="/menu/add" className="btn btn-primary  btn-md">
                                <MdAdd />
                            </Link></>

                    </div>
                    <div className="col">
                        <Form1.Group>
                            <Select
                                id="menuType"
                                onChange={filterByMenu}
                                placeholder="Select Menu..."
                                options={menuData}
                            />
                        </Form1.Group>
                    </div>
                    <div className="col">
                        {' '}
                        {
                            <Pagination
                                className="justify-content-center d-flex"
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
                            initialValues={searchMenuItems}
                            onSubmit={onMenuItemSearch}
                            validationSchema={searchSchema}>
                            {({ submitForm, handleChange }) => (
                                <Form id="menuItems search mx-2">
                                    <div className="form-group menuItemSearchBar">
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
                                            <strong>
                                                <MdSearch />{' '}
                                            </strong>
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-md-4 g-4 h-100 mt-1">{data.menuItemComponents}</div>
            </div>
        </React.Fragment>
    );
}

Menus.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number,
        roles: PropTypes.arrayOf(PropTypes.string),
    }),
};
export default Menus;
