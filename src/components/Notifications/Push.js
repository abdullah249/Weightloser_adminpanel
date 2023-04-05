import React, {useEffect, useState} from 'react';
// ** Reactstrap Imports
import {
    Button,
    Form, FormFeedback,
    Input,
    Label,
} from 'reactstrap'
import {Send, Trash} from 'react-feather'
import classnames from 'classnames'
import {useLocation, useNavigate} from "react-router";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Select from 'react-select'

import './style.css';
import api from "../../api/RequestInterceptor";
import {API_URLS} from "../../utils/API_URLS";
import * as Yup from "yup";
import {useFormik} from "formik";
import {allOption, avatarBg, SelectComponent, ShowAlert} from "./index";

let usersCached = [];
let refreshDataTime = 0
const validationSchema = Yup.object().shape({
    To: Yup.string().required("Please specify at least one recipient."),
    Title: Yup.string().max(25, 'Title should not be more than 25 characters').required("Please specify a title."),
    Body: Yup.string().max(65, 'Description should not be more than 25 characters').required()
});
const defaultData = {
    To: "",
    Title: "",
    Body: "",
}
const contentNotification = localStorage.getItem('drafted-push-loseWeight');
const initialData = {...(contentNotification ? JSON.parse(contentNotification) : defaultData)}
const Push = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // ** States
    const [sentToAll, setSendToAll] = useState(false);
    const [users, setUsers] = useState([...usersCached]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            const {data} = await api.get(API_URLS.user.listDevices);
            if (data) {
                refreshDataTime = new Date(new Date().getTime() + 5 * 60000);
                usersCached = data;
                setUsers(data)
            }
        } catch (ex) {
            console.error("Error in fetching user's list", ex.message);
        }
    }
    useEffect(() => {
        document.title = `Send Notification ➤ Weight Loser `;
        const currentTime = new Date().getTime();
        if (usersCached?.length === 0 && currentTime >= refreshDataTime) {
            fetchUsers();
        }
    }, []);


    // ** Toggles Compose POPUP
    const togglePopUp = e => {
        e.preventDefault()
        navigate(location.pathname)
    }

    const {
        values,
        handleChange,
        handleSubmit,
        errors,
        setFieldValue,
        handleReset,
    } = useFormik({
        initialValues: initialData,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const {To, Title, Body} = values;
            const emails = To.split(",");
            const DeviceId = users.filter(({Email}) => emails.includes(Email)).map(({DeviceId}) => DeviceId);
            if(DeviceId?.length === 0) return ShowAlert({message: "No recipient id is found", type: "error"});
            const payload = {Title, Body, DeviceId};
            setIsLoading(true);
            api.post(API_URLS.user.sendPush, payload).then(res => {
                const {data} = res;
                if (data) {
                    ShowAlert({message: "Notification sent successfully", type: "success"});
                    handleResetPush();
                }
            }).catch(err => {
                ShowAlert({message: "Error in sending notification", type: "error"});
                console.warn("ERROR => ", err);
            }).finally(() => setIsLoading(false));
        }
    });

    const validatingSubmit = () => {
        const errArr = Object.values(errors);
        if(errArr?.length > 0){
            return ShowAlert({message: errArr[0], type:'error'})
        }else handleSubmit()
    }

    const handleResetPush = () => {
        localStorage.removeItem("drafted-push-loseWeight")
        handleReset()
        navigate(location.pathname)
    }

    const handleEmailSelection = (e, name) => {
        let emails = e?.map(val => val.value);
        if (emails.includes('ALL')) {
            setSendToAll(true);
            emails = ['ALL']
            // emails = selectOptions.map((opt) => opt.value)
        } else if (sentToAll) setSendToAll(false);
        setFieldValue(name, emails?.join(","))
    }

    const uniqueSelectOptions = React.useMemo(() => {
        const tempArr = [];
        const tempObj = {};
        users.forEach(({Email, UserName}) => {
            if (!tempObj[Email]) {
                tempObj[Email] = true;
                const index = Math.floor(Math.random() * 5);
                const color = avatarBg[index]
                tempArr.push({
                    value: Email,
                    label: `${UserName} <${Email}>`,
                    name: UserName,
                    color: color
                })
            }
        })
        return tempArr;
    }, [users]);


    const selectedTo = React.useMemo(() => {
        const tempArr = values.To?.split(",");
        if (tempArr.includes('ALL')) return allOption;
        return uniqueSelectOptions.filter(opt => tempArr.includes(opt.value));
    }, [values.To, uniqueSelectOptions])

    return (
        <Form className='compose-form' onSubmit={e => e.preventDefault()}>
            <div className='compose-mail-form-field'>
                <Label for='email-to' className='form-label'>
                    To:
                </Label>
                <div className='flex-grow-1'>
                    <Select
                        isMulti
                        id='email-to'
                        isClearable={false}
                        value={selectedTo}
                        options={[allOption, ...(sentToAll ? [] : uniqueSelectOptions)]}
                        onBlurResetsInput={false}
                        className='react-select select-borderless'
                        onChange={(e) => handleEmailSelection(e, 'To')}
                        classNamePrefix='select'
                        components={{Option: SelectComponent}}
                    />
                </div>
            </div>
            <div className='compose-mail-form-field'>
                <Label for='email-subject' className='form-label'>
                    Title:
                </Label>
                <Input id='notify-title' name="Title" value={values.Title} onChange={handleChange}
                       placeholder='Push Title'/>
                {errors.Title && <FormFeedback>{errors.Title}</FormFeedback>}
            </div>
            <div id='message-editor'>
                <div className='form-floating mb-0'>
                    <Input
                        name='Body'
                        value={values.Body}
                        type='textarea'
                        id='exampleText'
                        placeholder='Push content'
                        style={{minHeight: '100px'}}
                        onChange={handleChange}
                        className={classnames({'text-danger': values.Body?.length > 55})}
                    />
                    <Label className='form-label' for='textarea-counter'>
                        Push Description
                    </Label>
                </div>
                <span
                    className={classnames('textarea-counter-value float-end', {
                        'bg-danger': values.Body?.length > 50
                    })}
                >
                          {`${values.Body?.length}/20`}
                        </span>
                {errors.Body && <FormFeedback>{errors.Body}</FormFeedback>}
            </div>
            <div className='compose-footer-wrapper'>
                <div className='btn-wrapper d-flex align-items-center'>
                    <Button color='primary' disabled={isLoading} onClick={validatingSubmit}>
                        {!isLoading ? (<>Send <Send size={12}/></>) : 'Sending...'}
                    </Button>
                </div>
                <div className='footer-action d-flex align-items-center'>

                    <Trash className='cursor-pointer' size={18} onClick={togglePopUp}/>
                </div>
            </div>
        </Form>
    )

}

export default Push;
