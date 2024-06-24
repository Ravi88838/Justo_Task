import React, { Fragment, useState } from "react";

const App = () => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [token, setToken] = useState();
  const [link, setLink] = useState();
  const [error, setError] = useState();
  const API_URL = "http://localhost:2000/api";
  const handleOneTimeLink = async () => {
    setError("");
    try {
      await fetch(`${API_URL}/one-time-link`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: username }),
      })
        .then((res) => {
          if (!res.ok) {
            setError("Invalid");
          }
          return res.json();
        })
        .then((data) => setLink("http://localhost:2000" + data))
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  const handleKickOut = async () => {
    setError("");
    try {
      await fetch(`${API_URL}/kick-out`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: username }),
      })
        .then((res) => {
          if (!res.ok) {
            setError("Invalid");
          }
          return res.json();
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  const handleLogin = async () => {
    setError("");
    try {
      await fetch(`${API_URL}/login`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username, password: password }),
      })
        .then((res) => {
          if (!res.ok) {
            setError("Invalid username and password");
          }
          return res.json();
        })
        .then((data) => setToken(data.token))
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };
  return (
    <Fragment>
      <h1>Login</h1>
      <div>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {!token && (
          <div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <button onClick={handleLogin}>Login</button>
            </div>
          </div>
        )}
        {token && (
          <div>
            <div>
              <button onClick={handleOneTimeLink}>One Time Link</button>
              {link}
            </div>
            <div>
              <button onClick={handleKickOut}>KickOut</button>
            </div>
          </div>
        )}
        <div>
          {error}
          {token}
        </div>
      </div>
    </Fragment>
  );
};

export default App;
