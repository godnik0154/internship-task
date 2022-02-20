import React from "react";
import styles from "./styles.module.css";
import axios from 'axios'

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1)
    arr.splice(index, 1);
  return arr;
}

let getBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});


function Dashboard({setDone}) {

  const [, forceUpdate] = React.useReducer(x => x + 1, 0);

  let loadFile = async (name,event) => {

    let dat = URL.createObjectURL(
      event.target.files[0]
    );

    console.log(event.target.files[0])

    let rest = event.target.files[0].name.substring(0, event.target.files[0].name.lastIndexOf(".")),
    last = event.target.files[0].name.substring(event.target.files[0].name.lastIndexOf("."), event.target.files[0].name.length);

    let newName = `${rest}-${Date.now()}${last}`;

    finalData[name] = {
      data: await getBase64(event.target.files[0]),
      type: event.target.files[0].type,
      name: newName
    };
    setFinalData(finalData);
    forceUpdate();

    event.target.nextElementSibling.style.backgroundImage = `url(${dat})`;
  };

  const initialState = {
    firstName: localStorage.getItem("firstName"),
    lastName: localStorage.getItem("lastName"),
    profilePicture: '',
    coverPicture: '',
    bio: '',
    email: localStorage.getItem('email'),
    organization:'',
    preferences: []
  }

  const initialError = {
    firstName: '',
    lastName: '',
    bio: '',
    preference: '',
    profile: ''
  }

  let [finalData,setFinalData] = React.useState(initialState);

  let [errors,setErrors] = React.useState(initialError);

  let checkRequired = () => {

    let valid = true;
    let newErr = errors;

    if(finalData.profilePicture === '')
    {
      newErr = {...newErr,profile:'Profile Picture cant be Empty'};
      valid = valid && false;
    }
    else
    {
      newErr = {...newErr,profile:''};
    }
    if(finalData.firstName === '')
    {
      newErr = {...newErr,firstName:'User First Name cant be Empty'};
      valid = valid && false;
    }
    else
    {
      newErr = {...newErr,firstName:''};
    }
    if(finalData.lastName === '')
    {
      newErr = {...newErr,lastName:'User Last Name cant be Empty'};
      valid = valid && false;
    }
    else
    {
      newErr = {...newErr,lastName:''};
    }
    if(finalData.bio.length === 0)
    {
      newErr = {...newErr,bio:'Bio cant be Empty'};
      valid = valid && false;
    }
    else if(finalData.bio.length !== 0 && finalData.bio.length > 150)
    {
      newErr = {...newErr,bio:'Bio must be of max 150 words'};
      valid = valid && false;
    }
    else
    {
      newErr = {...newErr,bio:''};
    }
    if(finalData.preferences.length > 2)
    {
      newErr = {...newErr,preferences:'You can select maximum 2 preferences'};
      valid = valid && false;
    }
    else
    {
      newErr = {...newErr,preferences:''};
    }

    setErrors(newErr);

    return valid;
  }

  let handleInputChange = (e) => {
    setFinalData({
      ...finalData,
      [e.target.name] : e.target.value
    })
  }

  let handleRadioChange = (e) => {
    if(e.target.checked)
      finalData.preferences.push(e.target.name.split('-').join(" "))
    else
      finalData.preferences = removeItemOnce(finalData.preferences,e.target.name.split('-').join(" "))
    setFinalData(finalData);
    forceUpdate();
  }

  let handleSubmit = async () => {
    if(checkRequired() === false)
      return;

    forceUpdate();

    let res = await axios.put(`http://localhost:8080/api/users/saveData`,{
      data: finalData
    });

    let data = res.data.data;

    console.log(data);

    setDone(false);
  }



  return (
    <React.Fragment>
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.bgPic}>
            <label className={styles.coverIconLabel} htmlFor="coverPicture">
              <span
                className={`fa-light fa-camera ${styles.coverSpan}`}
                style={{ marginTop: "10px" }}
              ></span>
              <span className={styles.coverSpan}>Change Image</span>
            </label>
            <input
              className={styles.coverInput}
              id="coverPicture"
              name="coverPicture"
              type="file"
              onChange={e=>loadFile('coverPicture',e)}
              accept="image/png,image/jpg,image/jpeg"
            />
            <div className={styles.bgCover}></div>
          </div>
          <div style={{ marginTop: "-5rem" }}>
            <div className={styles.profilePic}>
              <label className={styles.iconLabel} htmlFor="profilePicture">
                <span
                  className={`fa-light fa-camera ${styles.profileSpan}`}
                  style={{ marginTop: "10px" }}
                ></span>
                <span className={styles.profileSpan}>Change Image</span>
              </label>
              <input
                className={styles.profileInput}
                id="profilePicture"
                name="profilePicture"
                type="file"
                onChange={e=>loadFile('profilePicture',e)}
                accept="image/png,image/jpg,image/jpeg"
              />
              <div style={{border:errors.profile !== ''?`2px solid red`:null}} className={styles.imageArea}></div>
            </div>
          </div>
          <div className={styles.panelBody}>
            <div className={styles.panelHeading}>Profile Information</div>
            <div className={styles.panelForm}>
              <div className="mb-3">
                <label className="form-label" htmlFor="firstName">First Name</label>
                <input style={{border:errors.firstName !== ''?'1px solid red':""}} className="form-control" type="text" name="firstName" onChange={handleInputChange} value={finalData.firstName} placeholder="Enter First Name" />
                {errors.firstName !== ''?<small>{errors.firstName}</small>:null}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="lastName">Last Name</label>
                <input style={{border:errors.lastName !== ''?'1px solid red':""}} className="form-control" type="text" name="lastName" onChange={handleInputChange} value={finalData.lastName} placeholder="Enter Last Name" />
                {errors.lastName !== ''?<small>{errors.lastName}</small>:null}
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="organization">Organization Name</label>
                <input className="form-control" type="text" name="organization" onChange={handleInputChange} value={finalData.organization} placeholder="Enter organization Name" />
              </div>
              <div className="mb-3">
                <label className="form-label" htmlFor="bio">Bio</label>
                <textarea style={{border:errors.bio !== ''?'1px solid red':""}} className="form-control" type="text" name="bio" onChange={handleInputChange} value={finalData.bio} placeholder="Enter bio"></textarea>
                <div className="form-text">Enter Max upto 150 Words</div>
                {errors.bio !== ''?<small>{errors.bio}</small>:null}
              </div>
              <div className="mb-3">
                <label className="form-label">User preferences</label>
                <div className="form-check">
                  <input onChange={handleRadioChange} className="form-check-input" type="checkbox" name="sell-your-services" />
                  <label className="form-check-label">
                    Sell your services
                  </label>
                </div>
                <div className="form-check">
                  <input onChange={handleRadioChange} className="form-check-input" type="checkbox" name="sell-your-products" />
                  <label className="form-check-label">
                    Sell your products
                  </label>
                </div>
                <div className="form-check">
                  <input onChange={handleRadioChange} className="form-check-input" type="checkbox" name="publish-newsletters" />
                  <label className="form-check-label">
                    Publish newsletters
                  </label>
                </div>
                <div className="form-check">
                  <input onChange={handleRadioChange} className="form-check-input" type="checkbox" name="host-paid-events" />
                  <label className="form-check-label">
                    Host paid events
                  </label>
                </div>
                <div className="form-check">
                  <input onChange={handleRadioChange} className="form-check-input" type="checkbox" name="launch-a-membership" />
                  <label className="form-check-label">
                    Launch a membership
                  </label>
                </div>
                <div className="form-text">You can select maximum 2 preferences</div>
                {errors.preferences !== ''?<small>{errors.preferences}</small>:null}
              </div>
              <button onClick={handleSubmit} type="button" className="btn btn-dark" style={{marginBottom: "1rem"}}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Dashboard;
