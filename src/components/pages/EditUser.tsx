import React, { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { updateUser } from "../../redux/slice/userSlice";
import { AppDispatch } from "../../redux/store";
import Spinner from "../atoms/Spinner";
import Sidebar from "../organism/Sidebar";
import "../../styles/EditUser.css";
import "../../styles/Spinner.css";

const EditUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const userState = location.state;
  const { id } = userState || {};

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (userState?.name && nameRef.current) {
      nameRef.current.value = userState.name;
    }
    if (userState?.email && emailRef.current) {
      emailRef.current.value = userState.email;
    }
  }, [userState]);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedName = nameRef.current?.value;
    const updatedEmail = emailRef.current?.value;

    if (updatedName && updatedEmail) {
      if (!emailRegex.test(updatedEmail)) {
        setError("Invalid email.");
        setMessage("");
        return;
      }
      setClicked(true);
      try {
        await dispatch(
          updateUser({ id, name: updatedName, email: updatedEmail })
        ).unwrap();
        setMessage("User updated successfully!");
        setError(" ");
        setTimeout(() => navigate("/users"), 1500);
      } catch (err) {
        console.error("Error updating user:", err);
        setError("Error updating user.");
        setClicked(false);
      }
    } else {
      setError("Both fields are required.");
      setMessage("");
    }
  };

  return (
    <div>
      <Sidebar />
      <h2>Edit User</h2>
      <form onSubmit={handleUpdate}>
        <div className="edituser">
          <input ref={nameRef} placeholder="Name" />
          <input ref={emailRef} placeholder="Email" />
          <button onClick={handleUpdate} type="submit" disabled={clicked}>
            {clicked ? <Spinner /> : "Update"}
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default EditUser;
