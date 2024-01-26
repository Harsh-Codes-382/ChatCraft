// This file is only for to specify the routes of api for frontend S0, we can just simply import these routes particulary

export const HOST = 'http://localhost:3005';


export const AUTH_ROUTE = `${HOST}/api/auth`;

export const CHECK_EMAIL = `${AUTH_ROUTE}/check-user`;

export const ONBOARD_USER = `${AUTH_ROUTE}/onboard-user`;

export const GET_ALL_USER_BY_NAME = `${AUTH_ROUTE}/get-alluser-name`;

export const GENERATE_TOKEN = `${AUTH_ROUTE}/generate-token`;

// These routes are for messages
export const MESSAGE_ROUTE = `${HOST}/api/messages`;

export const ADD_MESSAGE = `${MESSAGE_ROUTE}/add-message`;

export const GET_ALL_MESSAGE = `${MESSAGE_ROUTE}/get-all-message`;

export const ADD_IMAGE_MESSAGE_ROUTE = `${MESSAGE_ROUTE}/add-image-message`;

export const ADD_VOICE_RECORD_MESSAGE_ROUE = `${MESSAGE_ROUTE}/add-voice-message`;

export const GET_INITIAL_CONTACTS = `${MESSAGE_ROUTE}/get-initial-contacts`;