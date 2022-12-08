import React from 'react';
import { Modal } from 'react-bootstrap';
import exampleImage from '../../assets/images/ingredientsCsvExample.png';
import debug from 'sabio-debug';
import PropTypes from 'prop-types';

const _logger = debug.extend('IngredientExampleModal');
const IngredientExampleModal = (props) => {

    _logger('props', props)

    return (
        <Modal size='xl' show={props.isOpen} onHide={props.toggleModal}>
            <Modal.Header closeButton>
                <Modal.Title>Ingredient CSV Example</Modal.Title>
            </Modal.Header>
            <img src={exampleImage} alt='exampleFile' />
        </Modal>
    )
}

IngredientExampleModal.propTypes = {
    isOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
}


export default IngredientExampleModal;