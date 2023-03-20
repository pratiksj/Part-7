import { useState, useEffect, useRef } from "react";
// import Blog from "./components/Blog";
import userService from "./services/users";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import { InfoOfUser } from "./components/InfoOfUser";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import loginService from "./services/login";
import { setNotification } from "./reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";
import { initializedBlog, createBlog } from "./reducers/blogReducer";
import { setUser } from "./reducers/userReducer";
import { Routes, Route, Link, useMatch, useNavigate } from "react-router-dom";
import User from "./components/User";
import Home from "./home/Home";
import { ListOfUser } from "./components/ListOfUser";
import { BlogDetails } from "./components/BlogDetails";
import { Container, AppBar, Toolbar, Button } from "@mui/material";

const App = () => {
  const noteFormRef = useRef();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");
  const [listOfUser, setListOfUser] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    console.log("this is from useeffect");
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
    dispatch(initializedBlog());
  }, []);

  useEffect(() => {
    userService.getAll().then((result) => {
      setListOfUser(result);
    });
  }, []);

  const matchUser = useMatch("/users/:id");

  const singleUser = matchUser
    ? listOfUser.find((user) => user.id === matchUser.params.id)
    : null;

  const matchBlog = useMatch("/blogs/:id");
  const singleBlog = matchBlog
    ? blogs.find((blog) => blog.id === matchBlog.params.id)
    : null;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      dispatch(setUser(user));
      // setUsername("");
      // setPassword("");
      dispatch(setNotification(`${user.name} has login successfully`, 3));
    } catch (exception) {
      //dispatch(setNotification("wrong username or password", 3));
    }
  };
  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        // username={username}
        // password={password}
        // handleUsernameChange={({ target }) => setUsername(target.value)}
        // handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  );

  const logOut = () => {
    window.localStorage.removeItem("loggedNoteappUser");
    dispatch(setUser(null));
    navigate("/");

    //setUser(null);
  };

  const addBlog = async (blogObject) => {
    dispatch(createBlog(blogObject));
    noteFormRef.current.toggleVisibility();
    dispatch(setNotification(`${blogObject.author} has added new blog`, 2));
    // } catch (error) {
    //   dispatch(setErrorMessage(error.response.data.error));
    // setTimeout(() => {
    //   dispatch(setErrorMessage(null));
    // }, 2000);
    // }
  };

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={noteFormRef}>
      <BlogForm createBlog={addBlog} />
      {/* <BlogForm /> */}
    </Togglable>
  );

  //const sortedBlog = blogs.sort((a, b) => b.likes - a.likes);

  return (
    <Container>
      <div>
        <Notification />
        <div>
          <AppBar position="static">
            <Toolbar>
              <Button color="inherit" component={Link} to="/">
                Blogs
              </Button>
              <Button color="inherit" component={Link} to="/users">
                Users
              </Button>
              <span
                style={{
                  position: "absolute",
                  right: "800px",
                  top: "19px",
                }}
              >
                <InfoOfUser logOut={logOut} />
              </span>
            </Toolbar>
          </AppBar>
        </div>

        <Routes>
          <Route
            path="/users"
            element={<User listOfUser={listOfUser} logOut={logOut} />}
          />
          <Route
            path="/users/:id"
            element={<ListOfUser singleUser={singleUser} logOut={logOut} />}
          />
          <Route
            path="/blogs/:id"
            element={<BlogDetails singleBlog={singleBlog} blogs={blogs} />}
          />
          <Route
            path="/"
            element={
              <Home
                user={user}
                loginForm={loginForm}
                logOut={logOut}
                blogForm={blogForm}
                blogs={blogs}
              />
            }
          />
        </Routes>
      </div>
    </Container>
  );
};

export default App;
