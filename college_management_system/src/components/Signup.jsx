import React, { useState } from "react";
import "../components/style.css";
import axios from 'axios';
 import {  toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";
 import {useNavigate,Link} from 'react-router-dom'
const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setLoading]=useState(false);

  const navigate=useNavigate()

const submitHandler=(event)=>{
event.preventDefault();
setLoading(true)
const formData= new FormData();
formData.append('fullName',fullName);
formData.append('email',email);
formData.append("phone", phone);
formData.append("password", password);
formData.append("image", image);
axios.post('http://localhost:4200/user/signup',formData)
.then(res=>{
  setLoading(false)
  toast.success('Account Creation Successful !')
  navigate('/login')
  console.log(res)
})
.catch(err=>{
  setLoading(false)
  toast.error('Something is wrong')
  console.log(err)
})
}

const fileHandler=(e)=>{
  setImage(e.target.files[0])
  setImageUrl(URL.createObjectURL(e.target.files[0]))
}

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <div className="signup-left">
          <img src={require("../assets/books.png")} alt="" />
          <h1 className="signup-left-heading">Campus360</h1>
          <p className="signup-left-para">
            Your Journey to Excellence Starts Here!
          </p>
        </div>
        <div className="signup-right">
          <hr />
          <form onSubmit={submitHandler} className="form">
            <h1>Create Your Account</h1>

            <input
              onChange={(e) => {
                setFullName(e.target.value);
              }}
              type="text"
              placeholder="Institute Name"
              required
            />
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="email"
              placeholder="Email "
              required
            />
            <input
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              type="text"
              placeholder="Phone "
              required
            />
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              placeholder="Password "
              required
            />
            <input required onChange={fileHandler} type="file" />
            {imageUrl && (
              <img className="your-logo" alt="logo" src={imageUrl} />
            )}
            <button type="submit">
              Register
              {isLoading && (
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>
              )}
            </button>
            <Link className='link' to="/login">Login With Your Account</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
