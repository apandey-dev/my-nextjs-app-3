import '../styles/globals.css';
import Layout from '../components/Layout';
import { UserProvider } from '../context/UserContext';

/**
 * Custom Next.js App Component
 * Wraps all pages with UserProvider for global state management (Task 1)
 * and Layout for consistent navigation and responsive structure.
 */
export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </UserProvider>
  );
}
