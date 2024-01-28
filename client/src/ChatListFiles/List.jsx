import React, { useEffect, useState } from 'react'
import { useStateProvider } from '../Context/StateContext';
import axios from 'axios';
import { GET_INITIAL_CONTACTS } from '../utils/Apiroutes';
import { reducerCases } from '../Context/Constants';
import ChatListItem from './ChatListItem';

const List = () => {
  const [{ userInfo, userContacts, contactSearch, filteredContacts }, dispatch] = useStateProvider();

  useEffect(() => {
    const getContacts = async () => {
      try {
        const { data: { users, onlineUsers } } = await axios(`${GET_INITIAL_CONTACTS}/${userInfo?.id}`);
        // console.log("users & onlineUsers: ", users, onlineUsers)

        dispatch({
          type: reducerCases.SET_USER_CONTACTS,
          userContacts: users
        })
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers
        })

      } catch (err) {
        console.error(err)

      }
    }
    if (userInfo?.id) {
      getContacts();
    }
  }, [userInfo])


  return (
    <div className='bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar'>
      {
        filteredContacts && filteredContacts.length > 0
          ?
          (filteredContacts.map((contact) => {
            return (
              <ChatListItem data={contact} key={contact.messageId} />
            )
          }))
          :
          (userContacts.map((contact) => {
            return (
              // data={...contact}
              <ChatListItem data={contact} key={contact.messageId} />
            )
          }))

      }

    </div>
  )
}

export default List
