import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'react-bootstrap';
import { HiOutlinePlusSm } from 'react-icons/hi';
import { getMenus, deleteMenu } from '../../services/menusService';
import debug from 'sabio-debug';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import SingleMenu from './SingleMenu';
import * as toastr from 'toastr';
import 'toastr/build/toastr.css';

const _logger = debug.extend('Menus');

const Menus = () => {
    const navigate = useNavigate();
    const [menuData, setMenuData] = useState({ arrayOfMenus: [], menuComponents: [] });
    const [paginationData, setPaginationData] = useState({
        pageIndex: 0,
        pageSize: 4,
        totalCount: 0,
        totalPages: 0,
    });

    useEffect(() => {
        _logger();
        getMenus(paginationData.pageIndex, paginationData.pageSize)
            .then(onGetMenusSuccess)
            .catch(onGetMenusError);
    }, [paginationData.pageIndex]);

    const onGetMenusSuccess = (response) => {
        _logger('onUploadSuccess', { response });
        let arrayOfMenus = response.item.pagedItems;
        setMenuData((prevState) => {
            const md = { ...prevState };
            md.arrayOfMenus = arrayOfMenus;
            md.menuComponents = arrayOfMenus.map(mapMenus);
            return md;
        });
        setPaginationData((prevState) => {
            const pd = { ...prevState };
            pd.totalCount = response.item.totalCount;
            _logger(pd, 'this is pd');
            return pd;
        });
    };

    const onGetMenusError = (error) => {
        _logger('onGetMenusError', { error });
        toastr['error']('Failed get menus.');
    };

    const onChange = (page) => {
        setPaginationData((prevState) => {
            const pd = { ...prevState };
            pd.pageIndex = page - 1;
            return pd;
        });
    };

    const mapMenus = (menu) => {
        return (
            <Col md={6} xxl={3} key={'menu-' + menu.id}>
                <SingleMenu menuData={menu} onMenuDelete={onMenuDelete} />
            </Col>
        );
    };

    const onBuildMenu = () => {
        _logger('New menu');
        navigate(`/menu/add`);
    };

    const onMenuDelete = useCallback((menuId) => {
        _logger(menuId, 'delete clicked');
        let payload = { id: menuId };
        _logger(payload, 'this is the payload');
        deleteMenu(menuId, payload).then(onMenuDeleteSuccess).catch(onMenuDeleteError);
    }, []);

    const onMenuDeleteSuccess = (menuId) => {
        _logger('onMenuDeleteSuccess', menuId);
        toastr['success']('Successfully deleted menu.');

        getMenus(paginationData.pageIndex, paginationData.pageSize)
            .then(onGetMenusSuccess)
            .catch(onGetMenusError);
    };

    const onMenuDeleteError = (error) => {
        _logger('onMenuDeleteError', { error });
        toastr['error']('Failed to delete menu.');
    };

    return (
        <>
            <Row className="mb-2">
                <Col sm={4}>
                    <Button variant="info" className="rounded-pill mb-3 mt-1" onClick={onBuildMenu}>
                        <HiOutlinePlusSm /> New Menu
                    </Button>
                </Col>
                <Col sm={8}>
                    <div className="text-sm-end"></div>
                </Col>
            </Row>
            <Row>
                {menuData.menuComponents}
                <Pagination
                    onChange={onChange}
                    current={paginationData.pageIndex + 1}
                    total={paginationData.totalCount}
                    pageSize={paginationData.pageSize}
                />
            </Row>
        </>
    );
};


export default Menus;
