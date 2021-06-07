import React from "react";

function PostLine({ post }) {
  return (
    <li className="post">
      <h4>{post.title}</h4>
      <p>{post.content}</p>
      <div>
        posted by {post.author} at{" "}
        {new Date(post.date).toString().slice(0, -27)}
      </div>
    </li>
  );
}

export default PostLine;
