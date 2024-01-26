import React from 'react';
import Image from 'next/image';
import axios from 'axios';
import {FcGoogle} from 'react-icons/fc';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { firebaseAuth } from '@/src/utils/firebase_config';
import { CHECK_EMAIL } from '@/src/utils/Apiroutes';
import { useRouter } from 'next/router';
import { useStateProvider } from '@/src/Context/StateContext';
import { reducerCases } from '@/src/Context/Constants';

const Login = () => {
    const router = useRouter();
    // Thsi will act as a action
    const [{}, dispatch] = useStateProvider()

    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            // Here we are extracting the user object & also some nested Object key from user & we are setting some values 
            const { user: {
                displayName: name,
                email,
                photoUrl: profileImage
            } } = await signInWithPopup(firebaseAuth, provider);

            if (email) {
                const { data } = await axios.post(CHECK_EMAIL, { email });
                
                // If user not found
                if (!data?.success) {
                    // This is a action which store boolean if user is new then store true So, we know this user is new
                    dispatch({
                        type: reducerCases.SET_NEW_USER,
                        newUser:true,
                    })

                    // This is a action 
                    dispatch({
                        // This is a action type
                        type: reducerCases.SET_USER_INFO,
                        // This is a action.userInfo in StateReducers.js & here we are setting the user info from when user signup with google
                        userInfo: { id:"", name, email, profileImage, status:'' }
                    })
                    router.push('/Onboard')
                }
                else{
                    dispatch({

                        type: reducerCases.SET_USER_INFO,

                        userInfo: { id:data?.user.id ,name: data?.user.name, email: data?.user.email, profileImage: data?.user.profilePhoto, status: data?.user.about }
                    })
                    router.push('/')
                }
                console.log(data);

            }
            else {
                throw new Error('User Not exist')
            }

        } catch (error) {
            console.error(error)
        }

    }

    
  return (
      <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
          <div className="flex justify-center items-center gap-2 text-white">
              <Image
                  src='/whatsapp.gif'
                  alt="Whatsapp Logo"
                  width={300}
                  height={300}
              />
              <span className="text-7xl">WhatsApp</span>
          </div>
          <button className='flex justify-center items-center bg-search-input-container-background p-5 rounded-lg gap-7' onClick={handleLogin}>
              <FcGoogle className="text-4xl" />
              <span className="text-white text-2xl">SignIn with Google</span>
          </button>
      </div>
  )
}

export default Login
