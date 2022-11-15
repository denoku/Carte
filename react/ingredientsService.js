
import axios from 'axios';
import * as helper from '../services/serviceHelpers';

const endpoint = `${helper.API_HOST_PREFIX}/api/ingredients`;

const getIngredients = () => {
    const config = {
        method: 'GET',
        url: endpoint,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const paginateByOrgId = (pageIndex, pageSize, id) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/organization?pageIndex=${pageIndex}&pageSize=${pageSize}&OrganizationId=${id}`,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const paginateByCreatedBy = (pageIndex, pageSize, id) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/current?pageIndex=${pageIndex}&pageSize=${pageSize}&createdBy=${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const searchPaginateByCreatedBy = (pageIndex, pageSize, id, query) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&createdBy=${id}&query=${query}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const ingredientDeleteById = (id) => {
    const config = {
        method: 'DELETE',
        url: `${endpoint}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const add = (payload) => {
    const config = {
        method: 'POST',
        url: endpoint,
        data: payload,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const ingredientUpdate = (payload, id) => {
    const config = {
        method: 'PUT',
        url: `${endpoint}/${id}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};

const selectIngredientsByOrgId = (orgId) => {
    const config = {
        method: 'GET',
        url: `${endpoint}/organizations/${orgId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    return axios(config).then(helper.onGlobalSuccess).catch(helper.onGlobalError);
};
const ingredientsService = {
    getIngredients,
    paginateByOrgId,
    paginateByCreatedBy,
    ingredientDeleteById,
    add,
    ingredientUpdate,
    selectIngredientsByOrgId,
    searchPaginateByCreatedBy
};
export default ingredientsService;