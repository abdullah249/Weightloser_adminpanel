import React, {useEffect, useState} from 'react';
// ** Reactstrap Imports
import {
    Button,
    Form, FormFeedback,
    Input,
    Label,
} from 'reactstrap'
import {Send, Trash, X} from 'react-feather'

import {useLocation, useNavigate} from "react-router";
import {Editor} from 'react-draft-wysiwyg'
import {convertToRaw, EditorState} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';
import {stateFromHTML} from 'draft-js-import-html';

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
    to: Yup.string().required("Please specify at least one recipient."),
    bcc: Yup.string(),
    cc: Yup.string(),
    subject: Yup.string().required("Please specify subject."),
    // body: Yup.string().required("Required")
});
const defaultEmail = {
    to: "",
    bcc: "",
    cc: "",
    subject: "",
    body: "",
}
const content = localStorage.getItem('drafted-email-loseWeight');
const initialValues = {...(content ? JSON.parse(content) : defaultEmail)}
const Email = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // ** States
    const [sentToAll, setSendToAll] = useState(false);
    const [ccOpen, setCCOpen] = useState(false)
    const [bccOpen, setBCCOpen] = useState(false)
    const [users, setUsers] = useState([...usersCached]);
    const contentState = stateFromHTML(initialValues.body);
    const editorStateDefault = EditorState.createWithContent(contentState);
    const [editorState, setEditorState] = useState(editorStateDefault);
    const [isLoading, setIsLoading] = useState(false);

    const fetchUsers = async () => {
        try {
            const {data} = await api.get(API_URLS.user.list);
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
        document.title = `Compose Mail ➤ Weight Loser `;
        const currentTime = new Date().getTime();
        if (usersCached?.length === 0 && currentTime >= refreshDataTime) {
            fetchUsers();
        }
    }, []);


    // ** CC Toggle Function
    const toggleCC = e => {
        e.preventDefault()
        setCCOpen(!ccOpen)
    }

    // ** BCC Toggle Function
    const toggleBCC = e => {
        e.preventDefault()
        setBCCOpen(!bccOpen)
    }


    const {
        values,
        handleChange,
        handleSubmit,
        errors,
        setFieldValue,
        handleReset,
    } = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const contentState = editorState.getCurrentContent();
            const rawContentState = convertToRaw(contentState);
            const htmlContent = stateToHTML(contentState);
            const bodyContent = {rawContentState, htmlContent};
            values.body = htmlContent;
            localStorage.setItem("drafted-email-loseWeight", JSON.stringify(values))
            const to = values.to?.split(",") || [];
            const cc = values.cc?.split(",") || [];
            const bcc = values.bcc?.split(",") || [];
            const payload = { Emails: [...to, ...cc, ...bcc], Title: values.subject, Body: `${htmlContent}`};
            setIsLoading(true)
            api.post(API_URLS.user.sendEmail, payload).then(res => {
                const {data} = res;
                if (data) {
                    ShowAlert({message: "Email sent successfully", type: "success"});
                    handleResetEmail();
                }
            }).catch(err => {
                ShowAlert({message: "Error in sending email", type: "error"});
                console.error("ERROR => ", err);
            }).finally(() => setIsLoading(false));
        }
    });

    const handleResetEmail = () => {
        localStorage.removeItem("drafted-email-loseWeight")
        handleReset()
        navigate(location.pathname)
    }


    const validatingSubmit = () => {
        const errArr = Object.values(errors);
        if(errArr?.length > 0){
            return ShowAlert({message: errArr[0], type:'error'})
        }else handleSubmit()
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
    let selectOptions = React.useMemo(() => users.map(({Email, UserName}) => {
        const index = Math.floor(Math.random() * 5);
        const color = avatarBg[index]
        return ({
            value: Email,
            label: `${UserName} <${Email}>`,
            name: UserName,
            color: color
        })
    }), [users]);

    const selectedTo = React.useMemo(() => {
        const tempArr = values.to?.split(",");
        if (tempArr.includes('ALL')) return allOption;
        const selected = selectOptions.filter(opt => tempArr.includes(opt.value));
        return selected;
    }, [values.to, selectOptions])

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
                        options={[allOption, ...(sentToAll ? [] : selectOptions)]}
                        onBlurResetsInput={false}
                        className='react-select select-borderless'
                        onChange={(e) => handleEmailSelection(e, 'to')}
                        classNamePrefix='select'
                        components={{Option: SelectComponent}}
                    />
                </div>
                <div>
                    <a href='/' className='toggle-cc text-body me-1' onClick={toggleCC}>
                        Cc
                    </a>
                    <a href='/' className='toggle-cc text-body' onClick={toggleBCC}>
                        Bcc
                    </a>
                </div>
            </div>
            {ccOpen === true ? (
                <div className='compose-mail-form-field cc-wrapper'>
                    <Label for='email-cc' className='form-label'>
                        Cc:
                    </Label>
                    <div className='flex-grow-1'>
                        <Select
                            isMulti
                            id='email-cc'
                            isClearable={false}
                            options={selectOptions}
                            className='react-select select-borderless'
                            onChange={(e) => handleEmailSelection(e, 'cc')}
                            classNamePrefix='select'
                            components={{Option: SelectComponent}}
                        />
                    </div>
                    <div>
                        <a href='/' className='toggle-cc text-body' onClick={toggleCC}>
                            <X size={14}/>
                        </a>
                    </div>
                </div>
            ) : null}
            {bccOpen === true ? (
                <div className='compose-mail-form-field cc-wrapper'>
                    <Label for='email-bcc' className='form-label'>
                        Bcc:
                    </Label>
                    <div className='flex-grow-1'>
                        <Select
                            isMulti
                            id='email-bcc'
                            isClearable={false}
                            options={selectOptions}
                            onChange={(e) => handleEmailSelection(e, 'bcc')}
                            className='react-select select-borderless'
                            classNamePrefix='select'
                            components={{Option: SelectComponent}}
                        />
                    </div>
                    <div>
                        <a href='/' className='toggle-cc text-body' onClick={toggleBCC}>
                            <X size={14}/>
                        </a>
                    </div>
                </div>
            ) : null}
            <div className='compose-mail-form-field'>
                <Label for='email-subject' className='form-label'>
                    Subject:
                </Label>
                <Input id='email-subject' name="subject" value={values.subject} onChange={handleChange}
                       placeholder='Subject'/>
                {errors.subject && <FormFeedback>{errors.subject.message}</FormFeedback>}
            </div>
            <div id='message-editor'>
                {/*<CKEditor*/}
                {/*    editor={ClassicEditor}*/}
                {/*    data={values.body}*/}
                {/*    onReady={(editor) => {}}*/}
                {/*    onChange={(event, editor) => {*/}
                {/*        const data = editor.getData();*/}
                {/*        setFieldValue("body", data);*/}
                {/*    }}*/}
                {/*    onBlur={(event, editor) => {}}*/}
                {/*    onFocus={(event, editor) => {}}*/}
                {/*/>*/}
                <Editor
                    placeholder='Message'
                    toolbarClassName='rounded-0'
                    wrapperClassName='toolbar-bottom'
                    editorState={editorState}
                    onEditorStateChange={(newState) => setEditorState(newState)}
                    editorClassName='rounded-0 border-0'
                    toolbar={{
                        options: ['inline', 'textAlign'],
                        inline: {
                            inDropdown: false,
                            options: ['bold', 'italic', 'underline', 'strikethrough']
                        }
                    }}
                />
            </div>
            <div className='compose-footer-wrapper'>
                <div className='btn-wrapper d-flex align-items-center'>
                    <div className='btn-wrapper d-flex align-items-center'>
                        <Button color='primary' disabled={isLoading} onClick={validatingSubmit}>
                            {!isLoading ? (<>Send <Send size={12}/></>) : 'Sending...'}
                        </Button>
                    </div>
                </div>
                <div className='footer-action d-flex align-items-center'>
                    <Trash className='cursor-pointer' size={18} onClick={handleResetEmail}/>
                </div>
            </div>
        </Form>
    )

}

export default Email;
