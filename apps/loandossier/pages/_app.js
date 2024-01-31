import '../src/styles/style.css';

if (typeof window === 'undefined') {
  require('../src/stubs/server');
}

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
