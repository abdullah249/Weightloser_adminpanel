import React from 'react';
import {
    Modal,
    ModalBody,
    ModalHeader,
} from 'reactstrap'
import {components} from 'react-select'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './style.css';

import Avatar from "./Avatar";
import Email from "./Email";
import Push from "./Push";
import {toast} from "react-toastify";


export const allOption = {value: 'ALL', label: 'All', color: 'danger'}
export const avatarBg = ['primary', 'secondary', 'success', 'warning', 'info'];

export const SelectComponent = ({data, ...props}) => {
    return (
        <components.Option {...props} style={{background: 'yellow'}}>
            <div className='d-flex flex-wrap align-items-center'>
                <Avatar className='my-0 me-50' size='sm' content={getAvatarLatter(data.name)} color={data.color}/>
                <span style={{marginLeft: 5}}> {data.label}</span>
            </div>
        </components.Option>
    )
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const getAvatarLatter = (name) => {
    if (!name) return "";
    let nameArr = name.split(" "); // split the name into an array of words
    let initials = "";

    for (let i = 0; i < nameArr.length; i++) {
        let word = nameArr[i];
        let firstTwoLetters = word.substring(0, 2); // extract the first two letters of each word
        initials += firstTwoLetters; // add the first two letters to the initials string
        if (initials.length === 2) break;
    }
    return initials?.toUpperCase();
}

export const ShowAlert = ({message, type = 'info', }) => {
    const msg = capitalizeFirstLetter(message);
    switch (type) {
        case 'success':
            toast.success(msg, {
                position: toast.POSITION.TOP_RIGHT,
            })
            break;
        case 'error':
            toast.error(msg, {  position: toast.POSITION.TOP_RIGHT,})
            break;
        case 'warning':
            toast.warn(msg, {  position: toast.POSITION.TOP_RIGHT,})
            break;
        default:
            toast.info(msg, {  position: toast.POSITION.TOP_RIGHT,})

    }
}


const Notifications = ({isOpen, setIsOpen, type}) => {
    const headerTitle = {email: "Compose Mail", push: "Send Push Notification"}

    return (
        <Modal isOpen={isOpen} toggle={() => setIsOpen(!isOpen)} className='modal-dialog-centered modal-lg'>
            <ModalHeader toggle={() => setIsOpen(!isOpen)}>{headerTitle[type]}</ModalHeader>
            <ModalBody>
                {type=== 'email' && <Email />}
                {type=== 'push' && <Push />}
            </ModalBody>
        </Modal>
    )

}

export {default as Email} from "./Email"
export {default as Notification} from "./Push"
export default Notifications;
