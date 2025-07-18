import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Spinnersvg from "../../images/spinner.svg";
import { fetchUsers, deleteUser, UserProps } from "../../redux/slice/userSlice";
import { AppDispatch, RootState } from "../../redux/store";
import Button from "../atoms/Button";
import Spinner from "../atoms/Spinner";
import Sidebar from "../organism/Sidebar";
import "../../styles/User.css";

const User = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { users, loading, error, deletingId } = useSelector(
    (state: RootState) => state.user
  );

  useEffect(() => {
    dispatch(fetchUsers()); //fetch user from API
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id));
  };

  const handleEdit = (user: UserProps) => {
    navigate(`/edit-user/${user.id}`, { state: user });
  };

  return (
    <div className="user">
      <Sidebar />
      <h2>User List</h2>
      <div className="adduserbtn">
        <Button label="Add User" onClick={() => navigate("/add-user")} />
      </div>
      {/* if user exist then display it in the talbe */}
      {loading ? (
        <div className="spinner-container">
          <img src={Spinnersvg} alt="Loading..." className="spinner" />
        </div>
      ) : error ? (
        <p>Error: {error}</p>
      ) : users.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Sr. no.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((props: UserProps, index: number) => (
              //displays user name email
              <tr key={props.id}>
                <td>{index + 1}</td>
                <td>{props.name}</td>
                <td>{props.email}</td>
                <td className="buttons">
                  <Button label="Edit" onClick={() => handleEdit(props)} />
                  <Button
                    label={deletingId === props.id ? <Spinner /> : "Delete"}
                    onClick={() => handleDelete(props.id)}
                    disabled={deletingId === props.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users</p> //if there is no user
      )}
    </div>
  );
};

export default User;
