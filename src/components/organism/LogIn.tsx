import { signInWithPopup } from "firebase/auth";
import React, { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { auth, provider } from "../../firebase";
import { login } from "../../redux/slice/authSlice";
import Button from "../atoms/Button";
import Form from "../molecules/Form";

import "../../styles/LogIn.css";

type LoginProps = {
  email: string;
  password: string;
};

const LogIn = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setError((prev) => ({ ...prev, [name]: "" })); //clear the error whenuser is typing
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  //fuction to validate
  const validate = () => {
    let valid = true;
    const newError = { email: "", password: "" };
    //email validation
    if (!data.email) {
      newError.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      newError.email = "Email is invalid";
      valid = false;
    }
    //password validation
    if (!data.password) {
      newError.password = "Password is required";
      valid = false;
    } else if (data.password.length < 8) {
      newError.password = "Password hast o be at least 8 characters";
      valid = false;
    }

    setError(newError); //if validation fails set an error
    return valid;
  };
  const dispatch = useDispatch();
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault(); //prevent page from setting to default on form submission
    if (validate()) {
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]"); //parse through local storage to get user details

      const matchUser = existingUsers.find(
        // check if the email password matches to any saved user
        (props: LoginProps) =>
          props.email.toLowerCase() === data.email.toLowerCase()
      );

      if (!matchUser) {
      setError({
        email: "No account found with this email",
        password: "",
      });
      setInfo("Don't have an account? Please register.");
      setSuccess("");
      return;
    }

    if (matchUser.password !== data.password) {
      setError({
        email: "",
        password: "Incorrect password",
      });
      setInfo("");
      setSuccess("");
      return;
    }

    // Successful login
    dispatch(login(matchUser));
    setSuccess("Login successful!");
    setError({ email: "", password: "" });
    setInfo("");

    setTimeout(() => {
      setSuccess("");
      navigate("/");
    }, 1000);
  }
  };

  //handle google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const matchUser = existingUsers.find(
        (u: LoginProps) =>
          u.email.toLowerCase() === (user.email || "").toLowerCase()
      );

      if (!matchUser) {
        //if user doesn't match
        const newUser = {
          email: user.email || "",
          password: "",
        };
        localStorage.setItem(
          "users",
          JSON.stringify([...existingUsers, newUser])
        );
      }

      dispatch(
        login({
          email: user.email || "",
          password: "",
        })
      );
      navigate("/");
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return (
    <div className="login">
      <div className="loginbox">
        <form onSubmit={handleSubmit}>
          <Form
            label="Email :"
            name="email"
            type="email"
            placeholder="Enter email"
            value={data.email}
            onChange={handleChange}
            onFocus={() => {}}
            error={error.email}
          />

          <Form
            label="Password :"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={data.password}
            onChange={handleChange}
            onFocus={() => {}}
            error={error.password}
          />

          <Button label="login" type="submit" onClick={() => {}} />
        </form>
        <div className="or">or</div>
        <Button
          label="Continue with Google"
          type="button"
          onClick={handleGoogleLogin}
        />

        {success && <p className="success">{success}</p>}
        {info && <p className="info">{info}</p>}
      </div>
    </div>
  );
};

export default LogIn;