

import React, { useState,useEffect } from "react";
import Modal from "react-modal"; // Import the Modal component
interface ImageProps {
    productid: number;
  }
function Image({ productid }: ImageProps) {
  const [imagesSelected, setImagesSelected] = useState<File[]>([]);
  const [publicIds, setPublicIds] = useState<string[]>([]);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State to hold error message
  const [modalPublicId, setModalPublicId] = useState<string | null>(null); // State to hold the publicId in the modal
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const handleUpdateImage = (publicId: string) => {
    setSelectedImage(publicId);
    setModalPublicId(publicId); // Set the publicId to be used in the modal
    setIsModalOpen(true);
  };
  const handleModalSubmit = () => {
    if (modalPublicId && updatedImage) {
      console.log(modalPublicId + "hii");
      let formData = new FormData();
      formData.append("file", updatedImage);
      formData.append("upload_preset", "soefvgjg");
  
      // First, upload the updated image to Cloudinary
      fetch("https://api.cloudinary.com/v1_1/dyjx3pq3u/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Updated image uploaded. Public ID:", data.public_id);
          setUpdatedImage(null);
  
    
          const updateApiUrl = `https://localhost:7008/api/Order/updateimagebyid/${modalPublicId}?newid=${data.public_id}`;
          return fetch(updateApiUrl, {
            method: "PUT",
          });
        })
        .then((updateResponse) => {
          if (!updateResponse.ok) {
            throw new Error(`HTTP error! Status: ${updateResponse.status}`);
          }
          console.log("Image ID updated successfully!");
  
      
          setIsModalOpen(false);
          setSelectedImage(null);
        })
        .catch((error) => {
          console.error("Error updating image ID:", error);
   
        });
    } else {
      console.error("No updated image selected");
    
    }
  };
  
  const handleFileChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      setUpdatedImage(selectedFiles[0]);
    }
  };
 

var Productid=productid;
var role=localStorage.getItem('userRoles');
const apiUrl = `https://localhost:7008/api/Order/GetimagesById/${Productid}`;
useEffect(() => {
  
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      setLoadedImages(data);
    })
    .catch((error) => {
      console.error("Error fetching images:", error);
    });
});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
     
      setImagesSelected((prevImages) => [
        ...prevImages,
        ...Array.from(selectedFiles),
      ]);
    }
  };

  const uploadImages = () => {
    if (imagesSelected.length === 0) {
      console.error("No files selected for upload");
      return;
    }
    const uploadPromises = imagesSelected.map((image) => {
      let formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "soefvgjg");
      return fetch("https://api.cloudinary.com/v1_1/dyjx3pq3u/image/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          return data.public_id;
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          return null;
        });
    });

    Promise.all(uploadPromises)
      .then((publicIds) => {
        setPublicIds(publicIds.filter((id) => id !== null) as string[]);
       
        setImagesSelected([]);
        const apiUrl = "https://localhost:7008/api/Order/AddImage";
        const requestBody = {
          productId: Productid,
          url: publicIds.join(","), 
        };
        fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("I posted images ", data);
          })
          .catch((error) => {
            console.error("Error uploading images:", error);
            setError("Oh hooo you can upload at most 3 images please.");
          });
        
      })
      .catch((error) => {
        console.error("Error uploading images:", error);
      });
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };
  return (
    <div>
      {role === "Admin" && (
        <>
          <input type="file" onChange={handleFileChange} multiple />
          <button onClick={uploadImages}>Upload Image</button>
        </>
      )}
   
      {publicIds.length >= 0 && (
        <div>
          <p> Images</p>
          {error && (
            <div className="alert alert-danger" role="alert" style={{ color: 'red' }}>
              {error}
            </div>
          )}
          {loadedImages.map((publicId, index) => (
            <div key={index}>
              <img
                src={`https://res.cloudinary.com/dyjx3pq3u/image/upload/${publicId}`}
                alt="Loaded"
                style={{ maxWidth: "100%", maxHeight: "200px", marginBottom: "40px" }}
              />
              {role === "Admin" && (
                <>
                  <button onClick={() => handleUpdateImage(publicId)} style={{ backgroundColor: 'blue' }}>Update Image</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Update Image Modal"
      >
        <h2>Update Image</h2>
        <input type="file" onChange={handleFileChanges} />
        <button onClick={handleModalSubmit}>Update Image</button>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
}
export default Image;