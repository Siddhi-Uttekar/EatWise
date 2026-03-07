import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.siddhiuttekar.me', // Default to localhost
});

// This is a simple example of an interceptor that adjusts the base URL
// In a real app, you would have logic to determine if you are in a production environment
if (process.env.NODE_ENV === 'production') {
  instance.defaults.baseURL = 'https://api.siddhiuttekar.me';
}

export default instance;
