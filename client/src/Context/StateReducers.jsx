import { reducerCases } from "./Constants";

export const initialState = {
    // This state is for to store user Info.
    userInfo: undefined,
    // This state is for to specify that this user is new one or not
    newUser: false,
    // This is for toggle the contact page
    contactPage: false,
    // This is to hold the user who's with logged in user chatting with
    currentChatUser: undefined,
    // This will hold all the messages which is coming from API
    messages: [],
    // We are storing the socket in global state because we may need to use socket in very diff. components so, we can emit an event anywhere
    socket: undefined,
    // This is for toggle the search Page
    messageSearch: false,
    // 
    userContacts: [],
    // 
    onlineUsers: [],
    // 
    filteredContacts: [],
    // contact search query user inputs
    contactSearch: "",
    // 
    videoCall: undefined,
    // 
    voiceCall: undefined,
    // 
    incomingVideoCall: undefined,
    // 
    incomingVoiceCall: undefined,



}

const reducer = (state, action) => {
    switch (action.type) {
        case reducerCases.SET_USER_INFO:
            return {
                ...state,
                userInfo: action.userInfo,
            }
        case reducerCases.SET_NEW_USER:
            return {
                ...state,
                newUser: action.newUser
            }
        case reducerCases.SET_CONTACT_PAGE:
            return {
                ...state,
                contactPage: !state.contactPage  // We just want toggle so, when contactPage is true here is false or vice-versa
            }
        case reducerCases.CURRENT_CHAT_USER:
            return {
                ...state,
                currentChatUser: action.currentChatUser
            }
        case reducerCases.SET_MESSAGES:
            return {
                ...state,
                messages: action.messages
            }
        case reducerCases.SET_SOCKET:
            return {
                ...state,
                socket: action.socket
            }
        case reducerCases.ADD_MESSAGE:  // This will add the message into the state "messages" from socket
            return {
                ...state,
                messages: [...state.messages, action.newMessages]
            }
        case reducerCases.SET_SEARCH_MESSAGE:
            return {
                ...state,
                messageSearch: !state.messageSearch, // Just toggle the search bar 
            }
        case reducerCases.SET_ONLINE_USERS:
            return {
                ...state,
                onlineUsers: action.onlineUsers
            }
        case reducerCases.SET_USER_CONTACTS:
            return {
                ...state,
                userContacts: action.userContacts
            }
        case reducerCases.SET_USER_CONTACT_SEARCH: {
            // We are making an array of filtered contacts on basis of contactSearch which holds the value user will put in search to find contacts
            // So, we are finding if searched user is in the userContacts array because it holds the all users contacts
            const filteredContacts = state.userContacts.filter((contact) => {
                return contact.reciever.name.toLowerCase().includes(action.contactSearch.toLowerCase())
            })
            return {
                ...state,
                contactSearch: action.contactSearch,
                filteredContacts,
            }
        }

        case reducerCases.SET_VIDEO_CALL:
            return {
                ...state,
                videoCall: action.videoCall
            }

        case reducerCases.SET_VOICE_CALL:
            return {
                ...state,
                voiceCall: action.voiceCall
            }

        case reducerCases.SET_INCOMING_VIDEO_CALL:
            return {
                ...state,
                incomingVideoCall: action.incomingVideoCall
            }

        case reducerCases.SET_INCOMING_VOICE_CALL:
            return {
                ...state,
                incomingVoiceCall: action.incomingVoiceCall
            }

        case reducerCases.END_CALL:
            return {
                ...state,
                voiceCall: undefined,
                videoCall: undefined,
                incomingVideoCall: undefined,
                incomingVoiceCall: undefined,
            }

        case reducerCases.SET_EXIT_CHAT:
            return {
                ...state,
                currentChatUser: undefined
            }

        default:
            return state;
    }
}

export default reducer;