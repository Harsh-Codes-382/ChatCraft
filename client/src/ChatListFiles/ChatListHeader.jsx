import React from 'react'
import Avatar from '../Components/Avatar';
import { useStateProvider } from '../Context/StateContext';
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from 'react-icons/bs'
import { reducerCases } from '../Context/Constants';

const ChatListHeader = () => {
  const [{ userInfo, contactPage }, dispatch] = useStateProvider()

  const ToggleContactPage = () => {
    // we are toggling the value of contactPage here frmo true to false or vice-versa
    dispatch({
      type: reducerCases.SET_CONTACT_PAGE
    })
  }
  return (
    <div className='h-16 px-4 py-3 flex justify-between items-center'>
      <div className='cursor-pointer '>
        <Avatar type="sm" image={userInfo?.profileImage} />

      </div>
      <div className="flex gap-6">

        <BsFillChatLeftTextFill className='text-panel-header-icon cursor-pointer text-xl' title="New Chat" onClick={ToggleContactPage} />
        <>
          <BsThreeDotsVertical className='text-panel-header-icon cursor-pointer text-xl' title='Menu' />
        </>

      </div>


    </div>
  )
}

export default ChatListHeader
