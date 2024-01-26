// These are for action type. Actually there is no need for making this file but we made it so, we don't need to hardcore the type name in other files if we just change here & everywhere we use these action types will be updated too & we don't need to change everywhere 
export const reducerCases = {
    SET_USER_INFO: "SET_USER_INFO",
    SET_NEW_USER: "SET_NEW_USER",
    SET_CONTACT_PAGE: "SET_CONTACT_PAGE",
    CURRENT_CHAT_USER: "CURRENT_CHAT_USER",
    SET_MESSAGES: "SET_MESSAGES",
    SET_SOCKET: "SET_SOCKET",
    ADD_MESSAGE: "ADD_MESSAGE",
    SET_SEARCH_MESSAGE: "SET_SEARCH_MESSAGE",
    SET_USER_CONTACTS: "SET_USER_CONTACTS",
    SET_ONLINE_USERS: "SET_ONLINE_USERS",
    SET_USER_CONTACT_SEARCH: "SET_USER_CONTACT_SEARCH",
    SET_VIDEO_CALL: "SET_VIDEO_CALL",
    SET_VOICE_CALL: "SET_VOICE_CALL",
    SET_INCOMING_VIDEO_CALL: "SET_INCOMING_VIDEO_CALL",
    SET_INCOMING_VOICE_CALL: "SET_INCOMING_VOICE_CALL",
    END_CALL: "END_CALL",
    SET_EXIT_CHAT: "SET_EXIT_CHAT"


}