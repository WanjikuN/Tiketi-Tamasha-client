import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@chakra-ui/react";
import { useSnackbar } from "notistack";

function Login({ isLoggedIn, setIsLoggedIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loginFormData, setLoginFormData] = useState({
    username: "",
    password: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginFormData),
      });

      if (response.ok) {
        setLoginFormData({ username: "", password: "" });
        enqueueSnackbar("Login Successful", { variant: "success" });
        setIsLoggedIn(true);
      } else {
        enqueueSnackbar("Login Failed", { variant: "error" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      enqueueSnackbar("Error during login", { variant: "error" });
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {!isLoggedIn ? (
        <div className="form">
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={loginFormData.username}
            onChange={(e) =>
              setLoginFormData({
                ...loginFormData,
                username: e.target.value,
              })
            }
          />
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={loginFormData.password}
              onChange={(e) =>
                setLoginFormData({
                  ...loginFormData,
                  password: e.target.value,
                })
              }
            />
            <span onClick={togglePasswordVisibility}>
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                style={{ fontSize: "16px" }}
              />
            </span>
          </div>
          <Button
            _hover={{ bg: "black" }}
            colorScheme="blue"
            onClick={handleLogin}
          >
            Login
          </Button>
          <p>
            Do not have an account?{" "}
            <Button
              colorScheme="blue"
              variant={"ghost"}
              onClick={() => setShowLogin(false)}
            >
              Sign Up
            </Button>
          </p>
        </div>
      ) : (
        <p>Display Logout Form or Other Content</p>
      )}
    </div>
  );
}

export default Login;
