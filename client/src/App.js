import React, { useEffect, useState } from "react";
import axios from "axios";
import PostLine from "./components/PostLine";

function App() {
  const [badPosts, setBadPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get("/scan").then((data) => {
      setIsLoading(false);
      setBadPosts(data.data);
    });
  }, []);

  return (
    <div className="App">
      <h1>Dark Net Scraper</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ol>
          {badPosts.map((post, i) => {
            return <PostLine post={post} key={i} />;
          })}
        </ol>
      )}
    </div>
  );
}

export default App;
