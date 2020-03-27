// externals
import React from "react";

const PhotoSelector = ({ onPhotoSelected }) => {
  const onFileSelect = e => {
    e.preventDefault();
    if (e.target.files[0]) {
      const selected = e.target.files;

      onPhotoSelected(selected[0]);
    }
  };

  return (
    <div>
      <input
        onChange={onFileSelect}
        multiple={false}
        capture="environment"
        type="file"
        accept="image/*;capture=camera"
        name={"photo-selector"}
        id={"photo-selector"}
      />

      <label htmlFor={"photo-selector"}>
        <button alt="Select a photo">SELECT A PHOTO</button>
      </label>
    </div>
  );
};

export default PhotoSelector;
