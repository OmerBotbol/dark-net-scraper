import React from "react";

function PostLine({ post }) {
  return (
    <div className="post">
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <div>
        posted by {post.author} at {post.date}
      </div>
    </div>
  );
}

export default PostLine;
