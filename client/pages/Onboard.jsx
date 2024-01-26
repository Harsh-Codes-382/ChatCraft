import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import { useStateProvider } from '@/src/Context/StateContext';
import Input from '@/src/Components/Input';
import Avatar from '@/src/Components/Avatar';
import axios from 'axios';
import { ONBOARD_USER } from '@/src/utils/Apiroutes';
import { useRouter } from 'next/router';
import { reducerCases } from '@/src/Context/Constants';



const Onboard = () => {
  const router = useRouter();
  // This is how we can access the info. stored in Global state like in redux
  const [{ userInfo, newUser }, dispatch] = useStateProvider();  // Becuase we call the useStateProvider() so, we can all the states from stateContext
  const [Name, setName] = useState(userInfo?.name || "");
  const [About, setAbout] = useState('');
  const [image, setImage] = useState("/default_avatar.png");

  // This useEffect runs everytime when userInfo, newUser, router changes
  useEffect(()=>{
    // This is for Security reasons if userinfo doens't have email means user is not coming from login page so move back him to login page & user is new user becuase if newUser is false then it means it is new user
    if(!newUser && !userInfo?.email){
      router.push('/login')
    }
    // if userinfo have email means user reach here from login page & user is also not a new member the move him to chat page
    else if(!newUser && userInfo?.email){
      router.push('/')
    }
  },[newUser, userInfo, router])

  const handleOnboardUser = async ()=>{
    if (validateUser()){
      const email = userInfo?.email;
      try {
        const data = await axios.post(ONBOARD_USER,{email, name:Name, profilePhoto:image, about:About} )

        console.log(data?.data);
        // we are seting these info. from api response to state in context means in userinfo
        const {id, about, name, profilePhoto} = data?.data.msg

        if(data?.data.success){
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: false,
          })

          // This is a action 
          dispatch({
            // This is a action type
            type: reducerCases.SET_USER_INFO,
            // This is a action.userInfo in StateReducers.js & here we are setting the user info from api response 
            userInfo: { id: id, name: name, email: data?.data.msg.email, profileImage: profilePhoto, status:about }
          })
          router.push('/')
        }
        
      } catch (error) {
        console.error(error)
      }
    }

  }

  const validateUser = ()=>{
    if(Name.trim().length < 3 ){
      return false;
    }
    return true;
  }
  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2">
          <Image
          src='/whatsapp.gif'
          alt="Whatsapp Logo"
          width={300}
          height={300}
          />
        <span className="text-7xl">WhatsApp</span>
        </div>
        <h2 className='text-2xl'>Create Your profile</h2>
        <div className="flex gap-6 mt-6">
        
          <div className="flex flex-col items-center justify-center gap-6 mt-5">
          <Input name={"Name"} state={Name} setState={setName} label />
          <Input name={"About"} state={About} setState={setAbout} label />
          <div className='flex justify-center items-center'>
            <button className='flex justify-center items-center bg-search-input-container-background p-3 rounded-lg gap-7 w-full' onClick={handleOnboardUser}>
              Create Profile
            </button>
          


          </div>
          </div>
        <Avatar type='xl' image={image} setImage={setImage} />
        </div>
    </div>
  )
}

export default Onboard;