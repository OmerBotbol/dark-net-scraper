import React, { useEffect, useState } from "react";
import axios from "axios";
import PostLine from "./components/PostLine";

function App() {
  const [badPosts, setBadPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const scanForPosts = () => {
    console.log("start scan");
    setIsLoading(true);
    axios.get("/api/scan").then((result) => {
      console.log("finish scan");
      setBadPosts(result.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    scanForPosts();
    setInterval(() => {
      scanForPosts();
    }, 120000);
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
