import { useState } from "react";

function App() {
  const [keyWords, SetKeyWords] = useState();

  const handleClick = () => {
    console.log(keyWords);
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
