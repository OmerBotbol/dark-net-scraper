import React, { useEffect, useState } from "react";
import axios from "axios";
import PostLine from "./components/PostLine";

function App() {
  const [badPosts, setBadPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const scanForPosts = () => {
    setIsLoading(true);
    axios.get("/api/scan").then((result) => {
      setIsLoading(false);
      setBadPosts(result.data);
    });
  };
  useEffect(() => {
    scanForPosts();
  }, []);

  setInterval(() => {
    axios.get("/api/scan").then((result) => {
      const newBadPosts = result.data;
      if (
        newBadPosts[0].title !== badPosts[0].title &&
        newBadPosts[0].date !== badPosts[0].date
      ) {
        setBadPosts(newBadPosts);
      }
    });
  }, 120000);

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
