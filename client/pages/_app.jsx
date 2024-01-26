import '@/styles/globals.css';
import Head from 'next/head';
import reducer, { initialState } from '@/src/Context/StateReducers';
import { StateProvider } from '@/src/Context/StateContext';

export default function App({ Component, pageProps }) {
  return ( 
   
       
      <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>WhatsApp Chat App</title>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
        <Component {...pageProps} />
      </StateProvider>
  );
}
