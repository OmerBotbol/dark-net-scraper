import { useState } from "react";
import axios from "axios";

function App() {
  const [keyWords, SetKeyWords] = useState();

  const handleClick = () => {
    axios.get(`/scan/${keyWords}`).then((data) => {
      console.log(data.data);
    });
  };

  return (
    <div className="App">
      <h1>Dark Net Scraper</h1>
      <input
        type="text"
        placeholder="Enter your key words here"
        onChange={(e) => SetKeyWords(e.target.value)}
      />
      <button onClick={() => handleClick()}>Scan</button>
    </div>
  );
}

export default App;
