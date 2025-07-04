import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { addUser } from "../../redux/slice/userSlice";
import { AppDispatch } from "../../redux/store";
import Spinner from "../atoms/Spinner";
import Sidebar from "../organism/Sidebar";
import "../../styles/AddUsers.css";
import "../../styles/Spinner.css";

const AddUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  //create references to access input element
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [clicked, setClicked] = useState(false);
  const navigate = useNavigate();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (clicked) return;

    setClicked(true);
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    setError('');
    setMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name && email) {
      //if both the value is there
      if (!emailRegex.test(email)) {
        setError("Invalid email.");
        setMessage("");
        setClicked(false);
        return;
      }
      try {
        await dispatch(addUser({ name, email })).unwrap();
        setMessage("User added successfully!");
        setError(" ");
        setTimeout(() => navigate("/users"), 1500);
      } catch (err) {
        console.error("thunk error:", err);
        setError("Error adding user.");
        setMessage('');
        setClicked(false);
      }
    } else {
      setError("Both fields are required.");
      setMessage("");
      setClicked(false);
    }
  };
  return (
    <div>
      <Sidebar />
      <h2>Add User</h2>
      <form onSubmit={handleAdd}>
        <div className="adduser">
          <input ref={nameRef} placeholder="Name" />
          <input ref={emailRef} placeholder="Email" />
          <button type="submit" disabled={clicked}>
            {clicked ? <Spinner /> : "Add"}
          </button>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default AddUser;
