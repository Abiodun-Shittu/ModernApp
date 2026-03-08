import { Button } from './components/ui/button';
import { useEffect, useState } from 'react';

function App() {
   const [message, setMessage] = useState('Hello from the client!!!');

   useEffect(() => {
      fetch('/api/hello')
         .then((response) => response.json())
         .then((data) => setMessage(data.message))
         .catch((error) => console.error('Error fetching message:', error));
   }, []);

   return (
      <div className="p-4">
         <p className="font-bold text-3xl">{message}</p>
         <Button>Click me</Button>
      </div>
   );
}

export default App;
