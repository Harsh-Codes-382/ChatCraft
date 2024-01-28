import React, { useEffect, useState } from 'react';
import { GET_ALL_USER_BY_NAME } from '../utils/Apiroutes';
import axios from 'axios';
import { BiArrowBack, BiSearchAlt } from 'react-icons/bi';
import { useStateProvider } from '../Context/StateContext';
import { reducerCases } from '../Context/Constants';
import ChatListItem from './ChatListItem';

const ContactList = () => {
    const [contactList, setcontactList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchContacts, setSearchContacts] = useState([])
    const [{ }, dispatch] = useStateProvider();

    useEffect(() => {
        if (searchTerm.trim().length > 0) {
            const filteredData = {};
            Object.keys(contactList).forEach((contact) => {
                filteredData[contact] = contactList[contact].filter((obj) => obj.name.toLowerCase().includes(searchTerm.toLowerCase()))
            })
            setSearchContacts(filteredData)
        }
        else {
            setSearchContacts(contactList)
        }
    }, [searchTerm])

    const getAllUsersByName = async () => {
        try {
            const { data: { userGrouped } } = await axios.get(GET_ALL_USER_BY_NAME);

            console.log(userGrouped)

            setcontactList(userGrouped)
            setSearchContacts(userGrouped)

        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getAllUsersByName();
    }, [])

    return (
        <div className='h-full flex flex-col'>
            <div className="h-24 flex items-center px-3 py-4">
                <div className="flex items-center gap-12 text-white">
                    <BiArrowBack className='cursor-pointer text-xl'
                        onClick={() => dispatch({ type: reducerCases.SET_CONTACT_PAGE })}
                    />
                    <span className=''>New Chat</span>
                </div>
            </div>
            <div className="flex-auto bg-search-input-container-background h-full overflow-auto custom-scrollbar">
                <div className="flex items-center gap-3 h-14">
                    <div className="flex items-center bg-panel-header-background mx-4 gap-5 px-3 py-1 rounded-lg flex-grow">
                        <div>
                            <BiSearchAlt className="text-panel-header-icon cursor-pointer text-lg" />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Search Contacts..."
                                className="bg-transparent text-sm focus:outline-none text-white w-full"
                                onChange={(e) => { setSearchTerm(e.target.value) }}
                                value={searchTerm}
                            />
                        </div>
                    </div>
                </div>

                {/* Object.entries(contactList) will make something like this 
        [
            [ "H", [ { "name": "Harsh Kumar", etc...}, {"name": "Harsh_K",etc..} ] ],
            [ "P",[ { "name": "Pawan Pawan",etc...} ] ],
            [ "R", [ { "name": "Rohit",etc...} ] ]
        ]

    .map(([initialLetter, userList])) it is a way to destruct the key, value pair from subArray like 

        map will iterate over "initialLetter" which is "H", "p", "R" as a output
        & userList is a subArray of user info
    */}



                {Object.entries(searchContacts).map(([initialLetter, userList]) => {

                    return (
                        userList.length > 0 && (
                            <div key={Date.now() + initialLetter}>
                                {userList.length && <div className="pl-10 text-teal-light py-5">{initialLetter}</div>}
                                {userList.map((user) => {
                                    return (
                                        <ChatListItem
                                            data={user}
                                            isContactPage={true}
                                            key={user.id}
                                        />)
                                })}
                            </div>
                        )

                    )
                })}

            </div>

        </div>
    )
}

export default ContactList
