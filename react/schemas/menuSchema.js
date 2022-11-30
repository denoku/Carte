import * as Yup from 'yup';

const menuSchema = Yup.object().shape({
    name: Yup.string().required().min(2, 'Must be minimum 2 characters').max(500, 'Must be maximum 500 characters'),
    organizationId: Yup.number().positive().required().min(1),
    description: Yup.string().min(2, 'Must be minimum 2 characters').max(500, 'Must be maximum 500 characters'),
    fileId: Yup.number().positive(),
    startDate: Yup.date(),
    endDate: Yup.date(),
    startTime: Yup.string(),
    endTime: Yup.string(),
    timeZoneId: Yup.number().positive().required('Please select a time zone.').min(1),
    menuDays: Yup.array().required('Please select at least one day.'),
    menuSections: Yup.array().required('Please select at least one section.'),
});

export default menuSchema;
