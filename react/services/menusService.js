import axios from 'axios';
import * as helper from './serviceHelpers';
import debug from 'sabio-debug';

const _logger = debug.extend('menusService');

const endpoint = `${helper.API_HOST_PREFIX}/api/menus`;

const getMenus = ( pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const addMenu = (menu) => {
    const config = {
        method: 'POST',
        url: `${endpoint}`,
        data: menu,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getTimeZones = () => {
    const config = {
        method: 'GET',
        url: `${endpoint}/timezones`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getMenusV2 = (organizationId, pageIndex, pageSize) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/paginateV2/${organizationId}/?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const getDaysOfWeek = () => {
    const config = {
        method: 'GET',
        url: `${endpoint}/daysofweek`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const deleteMenu = (menuId, payload) => {
    const config = {
        method: 'PUT',
        url: `${endpoint}/deleteupdate/${menuId}`,
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config)
        .then((response) => {
            _logger(response);
            return menuId;
        })
        .catch(helper.onGlobalError);
};

export { getMenus, addMenu, getTimeZones, getDaysOfWeek, getMenusV2, deleteMenu };
