import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { CgChevronDoubleUpO } from 'react-icons/cg';
import { useLocation, useParams } from 'react-router-dom';
import debug from 'sabio-debug';
import toastr from 'toastr';
import CartPreview from '../../components/mobilemenu/CartPreview';
import MenuDropDown from '../../components/mobilemenu/MenuDropDown';
import '../../components/mobilemenu/menuviewmobile.css';
import ModificationsModal from '../../components/mobilemenu/ModificationsModal';
import cartService from '../../services/cartService';
import menuModificationService from '../../services/menuModificationService';
import orgServices from '../../services/organizationService';

const _logger = debug.extend('MobileMenuMain');
const MobileMenu = ({ currentUser }) => {
    const params = useParams();
    const [org, setOrg] = useState({});
    const [active] = useState(false);

    const [collapse, setCollapse] = useState({
        counter: 0,
    });
    const [modal, setModal] = useState({
        isOpen: false,
        menuItem: { id: 0, price: 0, name: '' },
    });
    const [isShown, setIsShown] = useState(false);

    const toggle = () => {
        setIsShown((prevState) => !prevState);
    };
    const [cart, setCart] = useState({
        items: [],
        alteredItems: [],
        totalQuantity: 0,
        navData: { items: [] },
    });

    const location = useLocation();
    _logger('location mobile', location.state);

    const countCart = useRef(cart.items.length);
    var prevTotalQuantity = 0;
    const verifyOrder = (cart, item, quantity) => {
        if (
            (item.quantity >= 2 && countCart.current < cart.items.length) ||
            prevTotalQuantity - 1 < cart.totalQuantity
        ) {
            toastr.success(`${quantity} ${item.name}s added to your order!`);
            countCart.current += 1;
            prevTotalQuantity += quantity;
        } else if (countCart.current < cart.items.length || prevTotalQuantity < cart.totalQuantity) {
            toastr.success(`${quantity} ${item.name} added to your order!`);
            countCart.current += 1;
            prevTotalQuantity += quantity;
            _logger(countCart.current);
        }
    };

    const onCollapse = () => {
        setCollapse((prevState) => {
            let count = { ...prevState };
            count.counter += 1;
            return count;
        });
        window.scrollTo(50, 50);
    };

    const onAddtoCartClicked = useCallback(
        (item, quan) => {
            const payload = {
                menuItemId: item.id,
                quantity: quan,
                createdBy: currentUser.id,
                modifiedBy: currentUser.id,
            };
            item.quantity = quan;
            const onCreateCartSuccess = (response) => {
                _logger('onPostSuccess Data:', response);
                setCart((prevState) => {
                    const newCart = { ...prevState };
                    newCart.items = [...newCart.items];
                    if (newCart?.items && newCart?.items?.length > 0) {
                        var idx = newCart?.items?.findIndex((ci) => Number(ci.id) === Number(item.id));
                    }
                    if (idx >= 0) {
                        newCart.items[idx] = {
                            ...newCart?.items[idx],
                        };
                        newCart.items[idx].quantity = quan;
                        newCart.items[idx].cartItemId = response.item;
                    } else if (idx <= -1 || !idx) {
                        item.cartItemId = response.item;
                        newCart?.items?.push(item);
                    }
                    newCart.navData.userId = currentUser.id;
                    newCart.navData.orgId = params.orgId;
                    newCart.totalQuantity = newCart.totalQuantity += quan;
                    verifyOrder(newCart, item, quan);
                    return newCart;
                });
            };
            cartService.create(payload).then(onCreateCartSuccess).catch(onCreateErrorCartError);
        },
        [currentUser.id]
    );

    const onCreateErrorCartError = (error) => {
        _logger('error Updating', error);
        toastr.error('Unable to add to Cart');
    };
    useEffect(() => {
        orgServices.getOrgById(params.orgId).then(onGetOrgSuccess).catch(onGetOrgError);
        window.scroll(50, 0);
    }, []);

    const onCreateModSuccess = () => {
        toastr.success('Successfully added modified order to your cart!');
    };
    const onCreateModErr = () => {
        toastr.error('Error Modifying Order');
    };
    const onAddToCartModifiedErr = () => {
        _logger('catch fired');
    };
    const onAddModifiedOrder = (menuModAr, menuItem, price) => {
        const payload = { menuModifications: menuModAr };
        const onAddToCartModifiedSuccess = (res) => {
            payload.menuModifications.forEach((mod) => (mod.entityId = res.item));
            menuModificationService.createMenuModification(payload).then(onCreateModSuccess).catch(onCreateModErr);
            const modifiedItem = { ...menuItem };
            modifiedItem.id = menuItem.id;
            modifiedItem.price = menuItem.price;
            modifiedItem.total = price;
            modifiedItem.quantity = 1;
            setCart((prevState) => {
                const newCart = { ...prevState };
                newCart.alteredItems = [...newCart.alteredItems];
                newCart?.alteredItems?.push(modifiedItem);
                return newCart;
            });
        };
        const cartInfo = {
            menuItemId: modal.menuItem.id,
            quantity: 1,
            createdBy: currentUser.id,
            modifiedBy: currentUser.id,
        };
        cartService.create(cartInfo).then(onAddToCartModifiedSuccess).catch(onAddToCartModifiedErr);
    };

    const onGetOrgSuccess = (response) => {
        setOrg((prevState) => {
            let currentOrg = { ...prevState };
            currentOrg = response.item;
            return currentOrg;
        });
    };

    const onGetOrgError = (error) => {
        toastr.error('Failed to retrieve organization information.');
        _logger(error);
    };

    const onModToggle = useCallback((item) => {
        setModal((prevState) => {
            const modalState = { ...prevState };
            modalState.isOpen = !prevState.isOpen;
            modalState.menuItem = item;
            return modalState;
        });
    }, []);
    const onToggle = useCallback(() => {
        setModal((prevState) => {
            const modSt = { ...prevState };
            modSt.isOpen = !prevState.isOpen;
            return modSt;
        });
    }, []);

    return (
        <>
            {modal.isOpen && (
                <ModificationsModal
                    key={location.id}
                    onToggle={onToggle}
                    modalState={modal}
                    onAddModifiedOrder={onAddModifiedOrder}
                />
            )}
            <Container className="col-sm-12 col-md-12 col-lg-8 p-0 container-fluid menu-view-container">
                <Row
                    sm={12}
                    md={10}
                    lg={10}
                    xl={12}
                    className="form-group d-inline-flex menu-order-item-search-container px-0">
                    <form className="menu-order-item-search d-inline-flex justify-content-between">
                        <input name="search-menu" className="search-menu-input" />
                        <button type="button" className="btn btn-primary btn-sm menu-search-button">
                            Search
                        </button>
                        <Button variant="secondary" size="sm" onClick={toggle} className="menu-offcanvas-toggle mx-1">
                            Cart
                        </Button>
                        <span>
                            <CgChevronDoubleUpO className="close-all-menus align-center" onClick={onCollapse} />
                        </span>
                    </form>
                </Row>
                <Row>
                    <Col className="justify-content-center menu-list-col text-center mt-3">
                        <MenuDropDown
                            active={active}
                            className="p-0"
                            org={org}
                            userId={currentUser.organizationId}
                            onItemClick={onAddtoCartClicked}
                            collapseCount={collapse.counter}
                            onToggle={onModToggle}
                            location={location}
                        />
                    </Col>
                </Row>
                <CartPreview className="view-cart-offcanvas" cart={cart} isShown={isShown} toggle={toggle} />
            </Container>
        </>
    );
};

MobileMenu.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
        organizationId: PropTypes.number.isRequired,
    }),
    location: PropTypes.shape({
        state: PropTypes.shape({
            menuItem: PropTypes.shape({
                name: PropTypes.string.isRequired,
            }),
        }),
    }),
};

export default MobileMenu;
