import React from "react";

function PostLine({ post }) {
  return (
    <li className="post">
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <div>
        posted by {post.author} at {post.date}
      </div>
    </li>
  );
}

export default PostLine;
