import { createRoot } from 'react-dom/client';
import { App } from './app.tsx';
import './index.css';

const root = createRoot(document.getElementById('app')!);

root.render(<App />);

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/QRScoutTesting/sw.js')
      .then(registration => {
        console.log('Service Worker registered successfully:', registration.scope);
      })
      .catch(error => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
