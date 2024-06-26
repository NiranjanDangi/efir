import React, { useEffect, useState } from "react";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import axios from "axios";

const SigninDiv = ({ setCurrentUser, socket, setLogin }) => {
  const navigate = useNavigate();

  const SignUpHandler = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/signUp",
        userDetails
      );

      if (response.status === 200) {
        localStorage.setItem("token", response.data.data.token);
        setCurrentUser(response.data.data);
        socket.emit("login", {
          userId: response.data.data._id,
          socketId: socket.id,
        });
        navigate(`/`);
      } else {
        setCurrentUser();
      }
    } catch (error) {
      const { response } = error;
    }

    // const output = await response.json();
    //console.log(response)
  };

  const [userDetails, setUserDetails] = useState({
    name: "",
    mobile: "",
    email:"",
    password: "",
    CPassword: "",
    RememberMe: false,
    District: "Select District",
    SubDistrict: "",
  });

  const [pVisible, setPVisible] = useState({
    password: false,
    cpassword: false,
  });

  const [townTree, setTownTree] = useState({});

  // useEffect(() => {
  //   console.log(userDetails);
  // }, [userDetails]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/v1/fetchTownTree",
          {}
        );
        console.log(res);
        setTownTree(res.data.data.TownTree);
      } catch (err) {}
    };

    fetch();
  }, []);

  const changeHandler = (event) => {
    const { id, value, type, checked, name } = event.target;
    setUserDetails((state) => {
      return {
        ...state,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  useEffect(() => {
    const fetchData = async () => {};

    fetchData();
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="flex flex-col items-center shadow p-10 gap-2 py-4 rounded-xl min-w-[260px] w-[30%]">
        <div className="w-fit text-xl font-bold">Register Here</div>
        <div className="w-full">
          <p className="">Name</p>
          <input
            placeholder="Name"
            id="name"
            value={userDetails["name"]}
            name="name"
            onChange={changeHandler}
            className="px-2 py-1 bg-gray-100 rounded-lg shadow w-full"
          />
        </div>
        <div className="w-full">
          <p>Mobile No</p>
          <input
            placeholder="Mobile No"
            id="mobile"
            value={userDetails["mobile"]}
            name="mobile"
            onChange={changeHandler}
            className="px-2 py-1 bg-gray-100 rounded-lg shadow w-full"
          />
        </div>
        <div className="w-full">
          <p>Email</p>
          <input
            placeholder="Email Id"
            id="email"
            value={userDetails["email"]}
            name="email"
            onChange={changeHandler}
            className="px-2 py-1 bg-gray-100 rounded-lg shadow w-full"
          />
        </div>
        <div className="w-full">
          <p>District</p>
          <select
            id="District"
            value={userDetails["District"]}
            name="District"
            onChange={changeHandler}
            className="px-2 py-1 bg-gray-100 rounded-lg shadow w-full"
          >
            <option selected>Select District</option>
            {Object.keys(townTree).map((ele) => (
              <option id={ele}>{ele}</option>
            ))}
          </select>
        </div>
        <div className="w-full">
          <p>SubDistrict</p>
          {userDetails.District === "Select District" ? (
            <div className="px-2 py-1 bg-gray-100 rounded-lg shadow w-full text-gray-500">
              Please Select District
            </div>
          ) : (
            <select
              id="SubDistrict"
              value={userDetails["SubDistrict"]}
              name="SubDistrict"
              onChange={changeHandler}
              className="px-2 py-1 bg-gray-100 rounded-lg shadow w-full"
            >
              <option selected>Select SubDistrict</option>
              {townTree[userDetails["District"]].map((ele) => (
                <option>{ele}</option>
              ))}
            </select>
          )}
        </div>
        <div className="w-full relative">
          <p>Password</p>
          <input
            placeholder="Password"
            type={pVisible.password ? "text" : "password"}
            id="password"
            value={userDetails["password"]}
            name="password"
            onChange={changeHandler}
            className="px-2 py-1 bg-gray-100 rounded-lg shadow w-full"
          />
          <label
            id="password"
            className="absolute right-2 top-8"
            onClick={() =>
              setPVisible((state) => {
                state.password = !state.password;
                return { ...state };
              })
            }
          >
            {pVisible.password ? <MdVisibility /> : <MdVisibilityOff />}
          </label>
        </div>
        <div className="w-full relative">
          <p>Confirm Password</p>
          <input
            placeholder="Confirm Password"
            id="CPassword"
            type={pVisible.cpassword ? "text" : "password"}
            value={userDetails["CPassword"]}
            name="CPassword"
            onChange={changeHandler}
            className="px-2 py-1 bg-gray-100 rounded-lg shadow w-full"
          />
          <label
            id="cpassword"
            className="absolute right-2 top-8"
            onClick={() =>
              setPVisible((state) => {
                state.cpassword = !state.cpassword;
                return { ...state };
              })
            }
          >
            {pVisible.cpassword ? <MdVisibility /> : <MdVisibilityOff />}
          </label>
        </div>
        <div className="w-full">
          <label
            htmlFor="RememberMe"
            className="cursor-pointer select-none text-sm flex items-center gap-1 pl-2"
          >
            <input
              type="checkbox"
              id="RememberMe"
              name="RememberMe"
              checked={userDetails["RememberMe"]}
              onChange={changeHandler}
            />
            Remember Me
          </label>
        </div>
        <div
          onClick={SignUpHandler}
          className="w-fit text-center px-2 py-1 bg-green-500 shadow-inner  text-white rounded-xl transition-all duration-500 hover:bg-green-600 hover:scale-105"
        >
          SignUp
        </div>
        <div>
          Already have an account? <span onClick={() => setLogin(state => !state)} className="text-sky-600 cursor-pointer ">LogIn Here</span>
        </div>
      </div>
    </div>
  );
};

export default SigninDiv;
