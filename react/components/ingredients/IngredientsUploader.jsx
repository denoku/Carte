import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import debug from 'sabio-debug';
import { addIngredientsFiles } from '../../services/fileService';
import * as toastr from 'toastr';
import 'toastr/build/toastr.css';
import { TbCloudUpload } from 'react-icons/tb';
import { Row, Col, Card } from 'react-bootstrap';
import './ingredients.css';
import { Link, useNavigate } from 'react-router-dom';
import IngredientExampleModal from './ingredientExampleModal';

function IngredientsUploader() {
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const onModalClicked = () => {
        toggleModal();
    };
    const _logger = debug.extend('FileUploader');
    _logger('FileUploader Props', selectedFiles);

    const handleAcceptedFiles = (files) => {
        _logger('handleAcceptedFiles', { files });
        setSelectedFiles(files);
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });

        addIngredientsFiles(formData).then(onUploadSuccess).catch(onUploadError);
    };

    const onUploadSuccess = (response) => {
        _logger('onUploadSuccess', { response });
        toastr['success']('Successfully uploaded file.');
        setTimeout(navigate("/ingredients"), 1000)

    };

    const onUploadError = (error) => {
        _logger('onUploadError', { error });
        toastr['error']('Failed to upload file.');
    };

    return (

        <>

            <Row className="ingredientUploader">
                <IngredientExampleModal
                    isOpen={showModal}
                    toggleModal={toggleModal}
                />
                <Col>
                    <Card>
                        <Card.Body>
                            <h4 className="ingredient-Upload mb-3">Upload Ingredients CSV</h4>

                            <p className="text-muted font-13 m-b-30">
                                Here you can mass upload all your ingredients at once through the use of a csv file.
                                <Link className='mx-1' onClick={onModalClicked}>Example</Link>
                            </p>
                            <Dropzone accept={'text/csv'} onDrop={(acceptedFiles) => handleAcceptedFiles(acceptedFiles)}>
                                {({ getRootProps, getInputProps }) => (
                                    <div className="dropzone bg-light">
                                        <div className="dz-message needsclick" {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <h3>
                                                <TbCloudUpload />
                                            </h3>
                                            <h5>Drop files here or click to upload ingredients.</h5>
                                            <span className="text-muted font-13">(Accepted file type: .csv)</span>
                                        </div>
                                    </div>
                                )}
                            </Dropzone>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>

    );
}


export default IngredientsUploader;