import { ErrorMessage, Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import debug from 'sabio-debug';
import * as toastr from 'toastr';
import 'toastr/build/toastr.css';
import FileUploaderContainer from '../../components/FileUploaderContainer';
import menuSchema from '../../schemas/menuSchema';
import { addMenu, getDaysOfWeek, getTimeZones } from '../../services/menusService';


const _logger = debug.extend('NewMenuForm');

const NewMenuForm = (userOrg) => {
    _logger('userOrg', userOrg.currentUserOrg.id)
    const [formData, setFormData] = useState({
        name: '',
        organizationId: userOrg.currentUserOrg.id,
        description: '',
        fileId: 0,
        startDate: '00-00-0000',
        endDate: '00-00-0000',
        startTime: '00:00:00',
        endTime: '00:00:00',
        timeZoneId: 0,
        menuDays: [],
        menuSections: [],
    });

    const [timeZoneData, setTimeZoneData] = useState([]);
    const [daysOfTheWeek, setDaysOfTheWeek] = useState({
        arrayOfDays: [],
        mappedDays: [],
    });

    const { state } = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (state?.type === 'Edit_Menu') {
            _logger('state', state);
            setFormData(() => {
                const pd = state.payload;
                return pd;
            });
        }
        if (state === null) {
            setFormData((prevState) => {
                const pd = { ...prevState };
                pd.name = '';
                pd.organizationId = userOrg.id;
                pd.description = '';
                pd.fileId = 0;
                pd.startDate = '00-00-0000';
                pd.endDate = '00-00-0000';
                pd.startTime = '00-00-0000';
                pd.endTime = '00-00-0000';
                pd.timeZoneId = 0;

                return pd;
            });
        }
    }, [state]);
    useEffect(() => {
        getTimeZones().then(onGetTimeZonesSuccess).catch(onGetTimeZonesError);
        getDaysOfWeek().then(onGetDaysOfWeekSuccess).catch(onGetDaysOfWeekError);

        _logger(formData);
    }, []);

    const formatTime = (time) => {
        let timeStr = time;
        if (timeStr === '00:00:00') {
            return timeStr;
        } else {
            return timeStr + ':00';
        }
    };

    const onFormSubmit = (values) => {
        _logger(values, 'these are form values');
        values.startTime = formatTime(values.startTime);
        values.endTime = formatTime(values.endTime);

        // debugger;
        const startTime = `${values.startTime.replace('00:00', '00')}`;
        const endTime = `${values.startTime.replace('00:00', '00')}`;
        let newStartDate = values.startDate.replace('T00:00:00', '');
        let newEndDate = values.endDate.replace('T00:00:00', '');
        _logger(startTime, endTime);
        _logger('payload.menuDays', values.menuDays[0]);

        // if (!payload.id) {
        //     discountScheduleService.addSchedule(payload).then(onSuccess).catch(onError);
        // } else {
        //     if (payload.startTime.length >= 11) {
        //         payload.startTime = `${values.startTime.replace('00:00', '00')}`; // 03:33:00
        //     }
        //     if (payload.endTime.length >= 11) {
        //         payload.endTime = `${values.endTime.replace('00:00', '00')}`;
        //     }
        //     discountScheduleService.updateSchedule(payload).then(onSuccess).catch(onError);
        //     payload.endTime = `${values.endTime}`;
        //     payload.startTime = `${values.startTime}`;

        const payload = {
            ...values,
            // name: values.name,
            // description: values.description,
            // fileId: values.fileId,
            startDate: new Date(newStartDate),
            endDate: new Date(newEndDate),
            startTime: startTime,
            endTime: endTime,
            timeZoneId: values.timeZoneId,
            menuDays: values.menuDays.map((day) => day.value),
            // menuSections: values.menuSections.map((section) => section.value),
        };
        _logger('payload.menuDays', payload.menuDays[0]);
        _logger(payload, 'this is payload');

        addMenu(payload).then(onAddMenuSuccess).catch(onAddMenuError);
    };

    const onAddMenuSuccess = (response) => {
        _logger('onAddMenuSuccess', { response });
        toastr['success']('Successfully created menu.');
        navigate('/menus');
    };

    const onAddMenuError = (error) => {
        _logger('onAddMenuError', { error });
        toastr['error']('Failed to create menu.');
    };

    const onGetDaysOfWeekSuccess = (response) => {
        const days = response.items;
        _logger('onGetDaysOfWeekSuccess', days);
        setDaysOfTheWeek((prevState) => {
            const pd = { ...prevState };

            pd.arrayOfDays = days.map(mapLabels);
            pd.mappedDays = days.map(mapDays);
            _logger(pd);
            return pd;
        });
    };

    const onGetDaysOfWeekError = (error) => {
        _logger('onGetDaysOfWeekError', { error });
        toastr['error']('Failed to get days of the week.');
    };

    const onGetTimeZonesSuccess = (response) => {
        const timeZones = response.items;
        _logger('onGetTimeZonesSuccess', timeZones);
        setTimeZoneData(timeZones);
    };

    const onGetTimeZonesError = (error) => {
        _logger('onGetTimeZonesError', { error });
        toastr['error']('Failed to get timezones.');
    };

    const mapTimeZones = (timeZones) => {
        return (
            <option value={timeZones.id} key={`timeZones-${timeZones.id}`}>
                {' '}
                {timeZones.name}
            </option>
        );
    };

    const mapLabels = (item) => {
        let result = {
            label: item.name,
            value: item.id,
        };
        return result;
    };

    const mapDays = (aDay) => {
        return <option key={aDay.id} value={aDay.name}></option>;
    };

    const selectFileValue = (file, setFieldValue) => {
        _logger(file);
        setFieldValue('fileId', file[0].id);
    };

    const selectDaysValue = (day, setFieldValue) => {
        _logger(day);
        setFieldValue('menuDays', day);
    };

    // const selectTagsValue = (tag, setFieldValue) => {
    //     _logger(tag);
    //     setFieldValue('menuSections', tag);
    // };

    return (
        <Row>
            <Col>
                <Card>
                    <Card.Body>
                        <div>
                            <div className="col">
                                <h3 className=" text-center">Create a New Menu</h3>
                                <div className="row-3">
                                    <Formik
                                        onSubmit={onFormSubmit}
                                        enableReinitialize={true}
                                        initialValues={formData}
                                        validationSchema={menuSchema}>
                                        {({ setFieldValue }) => (
                                            <Form>
                                                <div className="container mt-4 fs-5">
                                                    <div className="row">
                                                        <div className="mb-3 col">
                                                            <label className="form-label" htmlFor="name">
                                                                Menu Name
                                                            </label>
                                                            <div className="d-flex">
                                                                <Field name="name" className="form-control" />
                                                            </div>
                                                            <ErrorMessage
                                                                name="name"
                                                                component="div"
                                                                className="has-error"
                                                            />
                                                        </div>
                                                        <div className="mb-3 col">
                                                            <label className="form-label" htmlFor="description">
                                                                Description
                                                            </label>
                                                            <div className="d-flex">
                                                                <Field
                                                                    id="description"
                                                                    name="description"
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                            <ErrorMessage
                                                                name="description"
                                                                component="div"
                                                                className="has-error"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="mb-3 col">
                                                            <label className="form-label" htmlFor="startDate">
                                                                Start Date
                                                            </label>
                                                            <div className="d-flex">
                                                                <Field
                                                                    className="form-control"
                                                                    type="date"
                                                                    dateformat="yyyy-MM-dd"
                                                                    id="startDate"
                                                                    name="startDate"
                                                                    placeholder="mm/dd/yyyy"
                                                                />
                                                            </div>
                                                            <ErrorMessage
                                                                name="startDate"
                                                                component="div"
                                                                className="has-error"
                                                            />
                                                        </div>
                                                        <div className="mb-3 col">
                                                            <label className="form-label" htmlFor="endDate">
                                                                End Date
                                                            </label>
                                                            <div className="d-flex">
                                                                <Field
                                                                    className="form-control"
                                                                    type="date"
                                                                    dateformat="yyyy-MM-dd"
                                                                    id="endDate"
                                                                    name="endDate"
                                                                    placeholder="mm/dd/yyyy"
                                                                />
                                                            </div>
                                                            <ErrorMessage
                                                                name="endDate"
                                                                component="div"
                                                                className="has-error"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="mb-3 col">
                                                            <label className="form-label" htmlFor="startTime">
                                                                Start Time
                                                            </label>
                                                            <div className="d-flex">
                                                                <Field
                                                                    className="form-control"
                                                                    type="time"
                                                                    id="startTime"
                                                                    name="startTime"
                                                                    placeholder="hh:mm:ss"
                                                                />
                                                            </div>
                                                            <ErrorMessage
                                                                name="startTime"
                                                                component="div"
                                                                className="has-error"
                                                            />
                                                        </div>
                                                        <div className="mb-3 col">
                                                            <label className="form-label" htmlFor="endTime">
                                                                End Time
                                                            </label>
                                                            <div className="d-flex">
                                                                <Field
                                                                    className="form-control"
                                                                    type="time"
                                                                    dateformat="hh:mm:ss"
                                                                    id="endTime"
                                                                    name="endTime"
                                                                    placeholder="hh:mm:ss"
                                                                />
                                                            </div>
                                                            <ErrorMessage
                                                                name="endTime"
                                                                component="div"
                                                                className="has-error"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="timeZoneId">
                                                            Select Time Zone
                                                        </label>
                                                        <Field
                                                            component="select"
                                                            name="timeZoneId"
                                                            className="form-control">
                                                            <option placeholder="Select Time Zone">
                                                                {' '}
                                                                Select Time Zone
                                                            </option>
                                                            {timeZoneData.map(mapTimeZones)}
                                                        </Field>
                                                    </div>
                                                    <div className="mb-3">
                                                        <label className="form-label" htmlFor="menuDays">
                                                            Select Days of the Week
                                                        </label>
                                                        <Select
                                                            name="menuDays"
                                                            isMulti={true}
                                                            onChange={(day) => {
                                                                _logger(day);
                                                                selectDaysValue(day, setFieldValue);
                                                            }}
                                                            className="react-select"
                                                            classNamePrefix="react-select"
                                                            options={daysOfTheWeek.arrayOfDays}></Select>
                                                    </div>
                                                    <div className="mb-3 mt-3">
                                                        <label className="form-label" htmlFor="menuImage">
                                                            Menu Image
                                                        </label>
                                                        <FileUploaderContainer
                                                            onHandleUploadSuccess={(file) => {
                                                                _logger(file[0].id);
                                                                selectFileValue(file, setFieldValue);
                                                            }}
                                                        />
                                                    </div>
                                                    <button type="submit" className="btn btn-primary">
                                                        Submit
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};


export default NewMenuForm;
