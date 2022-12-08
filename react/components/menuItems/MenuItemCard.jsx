import PropTypes from 'prop-types';
import 'rc-pagination/assets/index.css';
import React, { useState } from 'react';
import { Button, Card, Row } from 'react-bootstrap';
import { MdDeleteForever, MdShoppingCart } from 'react-icons/md';
import { TiEdit } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';
import logger from 'sabio-debug';
import Swal from 'sweetalert2';
import 'toastr/build/toastr.min.css';
import cartService from '../../services/cartService';
import './menuitems.css';

const _logger = logger.extend('MenuItemCard');
const MenuItemCard = (props) => {
    const menuItem = props.menuItem;
    let permissions = props?.currentUser?.roles;
    _logger('permissions??', permissions)
    const navigate = useNavigate();
    const [isShown, setIsShown] = useState(false);

    const onCardEnter = () => {
        if (permissions?.includes('OrgAdmin') || permissions?.includes('MenuEditor') || permissions?.includes('SysAdmin')) {
            setIsShown(true)
        }
        else {
            setIsShown(false)
        }
    }

    const onCardExit = () => {
        setIsShown(false)
    }

    function onDeleteSelected(e) {
        e.preventDefault();
        props.onDeleteClicked(menuItem, e);
    }

    const onEditClicked = () => {
        navigateToForm(menuItem);
        _logger('edit clicked', menuItem);
    };

    const navigateToForm = (menuItem) => {
        const state = { type: 'Edit_Menu', payload: menuItem };
        _logger(state);
        navigate(`/menuItem/builder/${menuItem.id}`, { state: state });
        _logger(menuItem);
    };

    const onAddToCart = () => {
        _logger('menuItem.id', menuItem.id);
        const cartPayload = {
            menuItemId: menuItem.id,
            quantity: 1,
            createdBy: 163,
            modifiedBy: 163,
            customerNotes: null,
        };
        cartService.create(cartPayload).then(onAddToCartSuccess).catch(onAddToCartError);
    };

    const onAddToCartSuccess = () => {
        Swal.fire({
            title: 'Menu Item Added!',
            text: 'Your menu Item was added to the cart!',
            icon: 'success',
            button: 'Close',
        });
        _logger('Success');
    };

    const onAddToCartError = () => {
        _logger('This isnt working');
    };

    return (
        <div className="justify-content-center">
            <Row className="menuItem-card">
                <Card className=" justify-content-center d-block">
                    {menuItem.imageUrl && (
                        <>
                            <img className="card-img-top menuItem-img" src={menuItem.imageUrl} alt="" />
                        </>
                    )}
                    <Card.Body
                        className={menuItem.imageUrl ? 'position-relative' : ''}
                        onMouseEnter={onCardEnter}
                        onMouseLeave={onCardExit} >
                        <h4 className='menuItems-card-title'>{menuItem.name}</h4>
                        <p>{menuItem.description}</p>
                        <p>${menuItem.unitCost}</p>
                        {isShown && (
                            <>
                                <div className="d-flex justify-content-center mt-2">
                                    <Button
                                        variant="primary"
                                        className="rounded-pill mb-3 mt-1 mx-2"
                                        data-page={menuItem}
                                        onClick={onEditClicked}>
                                        <TiEdit />
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="rounded-pill mb-3 mt-1 mx-2"
                                        onClick={onDeleteSelected}>
                                        <MdDeleteForever />
                                    </Button>
                                </div>
                            </>
                        )}
                        <Button
                            variant="primary"
                            className="rounded-pill mb-3 mt-1 mx-2"
                            onClick={onAddToCart}>
                            <MdShoppingCart />
                        </Button>
                    </Card.Body>
                </Card>
            </Row>
        </div>
    );
};

MenuItemCard.propTypes = {
    menuItem: PropTypes.shape({
        id: PropTypes.number.isRequired,
        unitCost: PropTypes.string.isRequired, //NOTE: leave this as string
        name: PropTypes.string.isRequired,
        description: PropTypes.string,
        imageUrl: PropTypes.string,
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
        isDeleted: PropTypes.bool,
        isPublic: PropTypes.bool,
        createdBy: PropTypes.number,
        modifiedBy: PropTypes.number,
    }),

    orderStatus: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }),
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.string)
    }),
    onDeleteClicked: PropTypes.func

};

export default React.memo(MenuItemCard);
