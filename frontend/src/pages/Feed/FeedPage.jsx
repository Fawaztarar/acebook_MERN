// frontend/src/pages/Feed/FeedPage.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPosts } from "../../services/posts";
import Post from "../../components/Post/Post";
import Navbar from "../../components/Navbar/Navbar"; 
import "./FeedPage.css";
import CreateNewPost from "../../components/Post/CreateNewPost";
import { getUser } from "../../services/users";

export const FeedPage = () => {
  document.title = "Posts"
  const [posts, setPosts] = useState([]);
  const [token, setToken] = useState(window.localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const [postChanged, setPostChanged] = useState(false);
  const navigate = useNavigate();
  const id = window.localStorage.getItem("id")
  const [newPost, setNewPost] = useState(false)

  useEffect(() => {
    if (token) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          setToken(data.token);
          window.localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
        });
      getUser(token, id)
        .then((data) => {
            setUser(data.user)
        })
        .catch((error) => {
            console.error(error)
        })
    } else {
      navigate("/login");
    }
  }, [token, navigate]); //Needed if useEffect is used anywhere else

  useEffect(() => {
    if (token) {
      getPosts(token)
        .then((data) => {
          setPosts(data.posts);
          setToken(data.token);
          setPostChanged(false)
          window.localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [postChanged])

  if (!token) {
    return;
  }

  return (
    <>
      <Navbar />
    
      <div className="allposts">
      <br></br>
      <br></br>
      <CreateNewPost token={token} setPostChanged={setPostChanged}/>
      <br></br>
      <h2>Posts</h2>
      <div className="feed" role="feed">
      {[...posts].reverse().map((post) => (
          <Post post={post} key={post._id} token={token} setNewPost={setPostChanged}/>
        ))}
          </div>
        </div>
    </>
  );
};
