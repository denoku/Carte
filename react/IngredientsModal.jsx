import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import PropTypes from 'prop-types';
import logger from 'sabio-debug';
import './ingredients.css'

const _logger = logger.extend('IngredientsModal');
const IngredientsModal = (props) => {

    const ingredient = props.ingredientViewed
    _logger('props', ingredient)
    return (
        <Modal show={props.isOpen} onHide={props.toggleModal} centered>
            <ModalHeader className='justify-content-center ingredientscard-title'
                onHide={props.toggleModal}>{ingredient.name}</ModalHeader>
            <ModalBody className='modal-body'>
                <p className=""><b>Description: </b> {ingredient.description}
                </p>
                <div className=" d-flex"><strong>Cost per unit: </strong><p className="">{ingredient.unitCost}</p></div>
                <div className=" d-flex"><strong>Measured by: </strong><p className="">{ingredient.measure}</p></div>
                <p className=""><b>Food Warning: </b> {ingredient.foodWarningTypes?.map((n) => n.name).join(", ")}
                </p>
                <ModalFooter>
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={props.toggleModal}>Close</button>
                </ModalFooter>
            </ModalBody>
        </Modal>
    )
}

IngredientsModal.propTypes = {
    ingredientViewed: PropTypes.shape({
        id: PropTypes.number,
        organizationId: PropTypes.number,
        name: PropTypes.string,
        unitCost: PropTypes.number,
        description: PropTypes.string,
        imageUrl: PropTypes.string,
        isInStock: PropTypes.bool,
        isDeleted: PropTypes.bool,
        restriction: PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        }),
        restrictionName: PropTypes.string,
        quantity: PropTypes.number,
        measure: PropTypes.string,
        createdBy: PropTypes.number,
        modifiedBy: PropTypes.number,
        foodWarningTypes: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
            })
        ),
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
    }),

    onModal: PropTypes.func,
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
};

export default IngredientsModal;