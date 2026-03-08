import { useEffect, useState } from "react"


function App() {
  const [message, setMessage] = useState('Hello from the client!!!');

  useEffect(() => {
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => console.error('Error fetching message:', error));
  }, []);

  return <p className="font-bold p-4 text-3xl">{message}</p>;
}

export default App
