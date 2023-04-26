import React,{useState}from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import {SERVER_URL} from '../constants.js'
import { Link } from 'react-router-dom'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

class Assignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selected: 0, assignments: [], courses:[], ids:[],email:"dwisneski@csumb.edu",message:""};
  };

 
  componentDidMount() {
    this.setData();
  }

  async setData(){
    await this.getCourseData();
    var select = document.getElementById("courses");
    
    //initializes date to today
    document.getElementById("date").valueAsDate = new Date();

    for (var i = 0; i < this.courses.length; i++) {
      var option = this.courses[i];
      var element = document.createElement("option");
      element.textContent = option;
      element.value = this.ids[i];
      select.appendChild(element);
    }
  }

async getCourseData(){
  var url = `${SERVER_URL}/getCourses?email=` + this.state.email;
  await axios.get(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
  })
  .then(({data}) => {
    var object = data;
    this.courses= Object.keys(object);
    this.ids= Object.values(object);
  });
}



  submitButton = ()=>{
    var aName = document.getElementById("name").value;
    if(aName.length<=0){alert("Enter a name!"); return;}
    var aDate = document.getElementById("date").value;
    var courseId = document.getElementById("courses").value;
    this.createAssignment(aName,aDate,courseId);
  }

  createAssignment = (name,date,course) => {
    fetch(`${SERVER_URL}/createAssignment`, 
    {  
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignmentName: name,
        dueDate: date,   
        courseId:course
      })
    } )
  .then((response) => response) 
  .catch(err => console.error(err)); 
  document.getElementById("name").value = "";
  document.getElementById("date").valueAsDate = new Date();
  alert("Assignment added!");

  // window.location.reload();
  }
  
  render() {
      return (
          <div align="center" className='content'>
            <div align="right" >
              <Button component={Link} to={{pathname:'/'}} 
                      variant="outlined" color="primary" disabled={false}  style={{margin: 10}}>
                Home
              </Button>
            </div>
            <h1>Create an assignment</h1>
            <br></br>
<form>
  <h3>Assignment Name</h3>
  <input type="text" name="name" placeholder='Name' id="name"/>
  <br></br><br></br>
  <h3>Course</h3>
  <select name="course" id="courses">
  </select>

  <h3>Due Date</h3>
  <input type="date" id ="date" />
</form>

<h3>{this.state.message}</h3>

<br></br><br></br>
            <Button  
              onClick={()=>this.submitButton()}
                    variant="outlined" color="primary" disabled={false}  style={{margin: 10}} id ="submit">
              Create
            </Button>
          </div>
      )
  }
}  

export default Assignment;