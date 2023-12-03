import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import "../styles/SignUp.css";

const Authentication = ({ setIsLoggedIn , isLoggedIn}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);
  const [type, setType] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    _password_hash: "",
    confirmPassword: "",
    phone_number: "",
    email: "",
    role_id: "",
  });
  const { enqueueSnackbar } = useSnackbar();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async () => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(formData._password_hash)) {
      alert(
        "Password must include at least one uppercase letter, one lowercase letter, one special character, and be at least six characters long."
      );
      return;
    }

    if (formData._password_hash !== formData.confirmPassword) {
      alert("Password and confirmation do not match.");
      return;
    }
    try {
      const userRole = roleOptions.find((role)=>role.name ==="User")
      if (!userRole){
        console.error("User role not found")
        return;
        
      }
      setFormData({...formData,role_id:userRole.id});
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
    
        const data = await response.json();
        if (data.role_id){
          const role =roleOptions.find((r)=>r.id == data.role_id);
          if(role){
            if (role.name ==="Admin"){
              alert("Welcome ,Admin");

            } else if (role.name ==="Organizer"){
              alert("Welcome,Organizer");

            } else if (role.name ==="User"){
              alert("Welcome ,User");
            }
          }

        }
        setType(true);
        navigate("/");
        enqueueSnackbar(`Hello, ${data.username}! Account created successfully`, {
          variant: "success",
        });
      } else {
       
        enqueueSnackbar("Signup failed", { variant: "error" });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      enqueueSnackbar("Error during signup", { variant: "error" });
    }
  };

  const handleLogin = async () => {
    

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
            email: formData.email,
            _password_hash: formData._password_hash,
          }),
      });

      if (response.ok) {
        
        const data = await response.json();
        setIsLoggedIn(true);
        navigate("/");
        enqueueSnackbar(`Hello, ${data.username}! Logged in successfully`, {
          variant: "success",
        });
      } else {
       
        enqueueSnackbar("Login failed", { variant: "error" });
      }
    } catch (error) {
      console.error("Error during login:", error);
      enqueueSnackbar("Error during login", { variant: "error" });
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch("http://localhost:5000/roles");
        const data = await response.json();
        if (response.ok) {
          const filteredRoles = data.filter((role)=> role.name !=="Admin");
          setRoleOptions(filteredRoles );
        } else {
          console.error("Failed to fetch roles:", data.error);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  return (
    <div data-testid="Authenticaton" className="authentication-container">
   
      <div className="authentication-form">
        <h2>{isLoggedIn ? "Login" : "Sign Up"}</h2>
        {!type && (
          <>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="input-field"
            />
            <select
              value={formData.role_id}
              onChange={(e) => setFormData({ ...formData, role_id: e.target.value })}
              className="input-field"
            >
              <option value="" disabled>Select a role</option>
                    {roleOptions.map((role) => (
                        
                        <option key={role.id} value={role.id}>
                        {role.name}
            </option>))}
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className="input-field"
            />
            
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input-field"
        />
        <div className="password-input">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData._password_hash}
            onChange={(e) => setFormData({ ...formData, _password_hash: e.target.value })}
            className="input-field"
          />
          {!isLoggedIn && (
          <div className="confirm-password-input">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input-field"
              />
            </div>)}
         
          <span onClick={togglePasswordVisibility} className="password-toggle">
            <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                style={{ fontSize: "16px" }}
              />
          </span>
        </div>
        <button onClick={type ? handleLogin : handleSignup} className="authentication-button">
          {type ? "Login" : "Sign Up"}
        </button>
        <p>
          {isLoggedIn ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="toggle-link"
            onClick={() => setIsLoggedIn(!isLoggedIn)}
          >
            {isLoggedIn ? "Sign Up" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};


export default Authentication;
