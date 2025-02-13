import React, { useState, useEffect } from "react";
import axios from "axios";

const Access = () => {
  const [loginData, setLoginData] = useState([]);
  const [formData, setFormData] = useState({ username: "", password: "", role: "admin" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAccessEntries();
  }, []);

  const fetchAccessEntries = async () => {
    try {
      const response = await axios.get("http://localhost:4040/api/access");
      setLoginData(response.data);
    } catch (error) {
      console.error("Error fetching access entries", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:4040/api/access/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:4040/api/access", formData);
      }
      setFormData({ username: "", password: "", role: "admin" });
      setEditingId(null);
      fetchAccessEntries();
    } catch (error) {
      console.error("Error saving access entry", error);
    }
  };

  const handleEdit = (id) => {
    const entry = loginData.find((item) => item._id === id);
    if (entry) {
      setFormData({ username: entry.username, password: "", role: entry.role });
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4040/api/access/${id}`);
      fetchAccessEntries();
    } catch (error) {
      console.error("Error deleting access entry", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Manage Access</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border rounded"
            required={!editingId} // Password required only for new entries
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="office">Office</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {editingId ? "Update" : "Add"} Login
          </button>
        </form>
      </div>

      {loginData.length > 0 && (
        <div className="mt-6 w-3/4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Username</th>
                <th className="border p-2">Password</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loginData.map((item) => (
                <tr key={item._id} className="text-center">
                  <td className="border p-2">{item.username}</td>
                  <td className="border p-2">{item.password}</td>
                  <td className="border p-2">{item.role}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(item._id)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Access;






{/*}
import React, { useState } from "react";

const Access = () => {
  const [loginData, setLoginData] = useState([]);
  const [formData, setFormData] = useState({ username: "", password: "", role: "admin" });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedData = [...loginData];
      updatedData[editingIndex] = formData;
      setLoginData(updatedData);
      setEditingIndex(null);
    } else {
      setLoginData([...loginData, formData]);
    }
    setFormData({ username: "", password: "", role: "admin" });
  };

  const handleEdit = (index) => {
    setFormData(loginData[index]);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    setLoginData(loginData.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Manage Access</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
            <option value="office">Office</option>
          </select>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            {editingIndex !== null ? "Update" : "Add"} Login
          </button>
        </form>
      </div>

      {loginData.length > 0 && (
        <div className="mt-6 w-3/4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Username</th>
                <th className="border p-2">Password</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loginData.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{item.username}</td>
                  <td className="border p-2">{item.password}</td>
                  <td className="border p-2">{item.role}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Access;





{/*}
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const AccessPage = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ username: "", role: "", password: "" });
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:4040/api/access");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { username: formData.username, role: formData.role };
      if (!editingUser) data.password = formData.password; // Only send password when adding a new user
      if (editingUser) {
        await axios.put(`http://localhost:4040/api/access/${editingUser._id}`, data);
      } else {
        await axios.post("http://localhost:4040/api/access", formData);
      }
      fetchUsers();
      setFormData({ username: "", role: "", password: "" });
      setEditingUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData({ username: user.username, role: user.role, password: "" });
    setEditingUser(user);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4040/api/access/${id}`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Access Management</h2>

        {/* Form /}
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-6 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="employee">Employee</option>
                <option value="office">Office</option>
              </select>
            </div>
            {!editingUser && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
          </div>
          <button type="submit" className="w-full mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
            {editingUser ? "Update User" : "Add User"}
          </button>
        </form>

        {/* Table /}
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Existing Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100 transition">
                    <td className="p-3">{user.username}</td>
                    <td className="p-3">{user.role}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition" onClick={() => handleEdit(user)}>
                        <FaEdit />
                      </button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition" onClick={() => handleDelete(user._id)}>
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccessPage;
*/}