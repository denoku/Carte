import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { TiPencil } from 'react-icons/ti';
import { MdDeleteForever } from 'react-icons/md';
import 'rc-pagination/assets/index.css';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/formatDate';
import { formatTime } from '../../utils/formatTime';
import debug from 'sabio-debug';
import 'toastr/build/toastr.css';
import '../menus/newMenu.css';

const _logger = debug.extend('SingleMenu');

const SingleMenu = (props) => {
    const menu = props.menuData;
    _logger('menu', menu)
    const navigate = useNavigate();

    function onDeleteSelected(e) {
        e.preventDefault();
        props.onMenuDelete(menu, e);
    };

    const onEditClicked = () => {
        navigateToForm(menu);
        _logger('edit clicked', menu)
    };

    const navigateToForm = (menu) => {
        const state = { type: 'Edit_Menu', payload: menu };
        _logger(state);
        navigate(`/menu/edit/${menu.id}`, { state: state });
        _logger(menu);
    };

    return (
        <Card className="d-block">
            {menu.image && (
                <>
                    <img className="menu-card-img-top" src={menu.image} alt="" />
                </>
            )}
            <Card.Body className={menu.image ? 'position-relative' : ''}>
                <h3>{menu.name}</h3>

                <p className="mb-1">
                    <b>Description:</b> {menu.description}
                </p>
                <p className="mb-1">
                    <b>Start Date:</b> {formatDate(menu.startDate)} <b>End Date:</b> {formatDate(menu.endDate)}
                </p>
                <p className="mb-1">
                    <b>Start Time:</b> {formatTime(menu.startTime)} <b>End Time:</b> {formatTime(menu.endTime)}
                </p>
                <div className="d-flex justify-content-center mt-2">
                    <Button
                        variant="primary"
                        className="rounded-pill mb-3 mt-1 mx-2"
                        data-page={menu}
                        onClick={onEditClicked}>
                        <TiPencil />
                    </Button>
                    <Button variant="danger" className="rounded-pill mb-3 mt-1 mx-2" onClick={onDeleteSelected}>
                        <MdDeleteForever />
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};
SingleMenu.propTypes = {
    menuData: PropTypes.shape([]),
    onMenuDelete: PropTypes.func,
};
export default SingleMenu;
