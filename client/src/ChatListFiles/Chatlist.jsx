import React, { useState, useEffect } from 'react';
import List from './List';
import ChatListHeader from './ChatListHeader';
import SearchBar from './SearchBar';
import { useStateProvider } from '../Context/StateContext';
import ContactList from './ContactList'

const Chatlist = () => {
  const [PageType, setPageType] = useState('default');
  const [{ contactPage }] = useStateProvider(); // contactPage state is boolean it's value getting toggled in chatListHeader.jsx

  // This useEffect call everytime when we toggling the value of contactPage global state
  useEffect(() => {
    if (contactPage) {  // If it is true
      setPageType('all-contacts') // then set this to state
    }
    else {
      setPageType('default')
    }
  }, [contactPage])
  return (
    <div className='bg-panel-header-background flex flex-col max-h-screen z-20'>
      {
        // Toggling the state so,  we can render this dynamic components
        PageType === 'default' && (
          <>
            <ChatListHeader />
            <SearchBar />
            <List />
          </>
        )
      }

      {
        PageType === 'all-contacts' && (

          <ContactList />

        )
      }

    </div>
  )
}

export default Chatlist
