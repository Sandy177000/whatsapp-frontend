import React from "react";
import ReactDOM from "react-dom";

function PhotoPicker({onChange}) {

  const component = (
    <input
      type="file" 
      hidden 
      id="photo-picker" 
      onChange={(e)=>onChange(e)} />
  );
  
  // creates the dialog box to pick files which renders _document.jsx
  return ReactDOM.createPortal(
    component,
    document.getElementById("photo-picker-element")
  );

}

export default PhotoPicker;
