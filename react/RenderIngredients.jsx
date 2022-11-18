import React, { useState } from 'react';
import PropTypes from 'prop-types';
import logger from 'sabio-debug';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row } from 'react-bootstrap';
import { MdDeleteForever } from 'react-icons/md';
import { TiEdit, TiEye } from 'react-icons/ti';
import './ingredients.css';

const _logger = logger.extend('RenderIngredients');

const RenderIngredients = (props) => {
    _logger('props', props);
    const [isShown, setIsShown] = useState(false);
    const ingredient = props.ingredient;
    const navigate = useNavigate();

    function onDeleteIngredient(e) {
        e.preventDefault();
        _logger('Delete: ', ingredient.id);
        _logger('event', e);
        props.onIngredientClicked(ingredient, e);
    }

    const onEditClicked = () => {
        navigateToForm(ingredient);
    };

    const navigateToForm = (ingredient) => {
        const state = { type: 'Edit_Ingredient', payload: ingredient };
        _logger(state);
        navigate(`/ingredient/edit/${ingredient.id}`, { state: state });
        _logger(ingredient);
    };

    const onModalClicked = (e) => {
        e.preventDefault();
        props.onModal(ingredient, e)
    }

    const onCardEnter = () => {
        setIsShown(!isShown)
    }

    return (
        <div className="justify-content-center">
            <Row className='ingredientsCard'>
                <Card className=" justify-content-center d-block">
                    {ingredient.imageUrl && (
                        <>
                            <img className="card-img-top ingredientsImage" src={ingredient.imageUrl} alt="" />
                        </>
                    )}
                    <Card.Body className={ingredient.imageUrl ? 'position-relative' : ''}
                        onMouseEnter={onCardEnter}
                        onMouseLeave={onCardEnter} >
                        <h4 className='ingredientscard-title'>{ingredient.name}</h4>
                        <div className="d-flex justify-content-center mt-2">
                            {isShown &&
                                (<>
                                    <Button
                                        variant="primary"
                                        className="rounded-pill mb-3 mt-1 mx-2"
                                        data-page={ingredient}
                                        onClick={onEditClicked}>
                                        <TiEdit />
                                    </Button>
                                    <Button variant="danger" className="rounded-pill mb-3 mt-1 mx-2" onClick={onDeleteIngredient}>
                                        <MdDeleteForever />
                                    </Button>



                                    <Button type="button" className="rounded-pill mb-3 mt-1 mx-2" onClick={onModalClicked} >
                                        <TiEye />
                                    </Button>
                                </>)}
                        </div>
                    </Card.Body>
                </Card>
            </Row>
        </div>
    );
};

RenderIngredients.propTypes = {
    ingredient: PropTypes.shape({
        id: PropTypes.number.isRequired,
        organizationId: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        unitCost: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        imageUrl: PropTypes.string.isRequired,
        isInStock: PropTypes.bool.isRequired,
        isDeleted: PropTypes.bool.isRequired,
        restriction: PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string,
        }),
        restrictionName: PropTypes.string,
        quantity: PropTypes.number.isRequired,
        measure: PropTypes.string.isRequired,
        createdBy: PropTypes.number.isRequired,
        modifiedBy: PropTypes.number.isRequired,
        foodWarningTypes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string.isRequired,
            })
        ),
        dateCreated: PropTypes.string.isRequired,
        dateModified: PropTypes.string.isRequired,
    }),
    onIngredientClicked: PropTypes.func.isRequired,
    onModal: PropTypes.func
};

export default RenderIngredients;