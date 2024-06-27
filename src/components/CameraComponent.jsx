// import React, { useRef, useState } from 'react';
// import { ReactComponent as Facingicon } from './facingIcon.svg';
// import { ReactComponent as PhotoIcon } from './photoIcon.svg';
// import '../App.css';
// import Webcam from 'react-webcam';

// function CameraComponent() {
//   const [error, setError] = useState();
//   const [isEnabled, setEnabled] = useState(false);
//   const [facing, setFacing] = useState('user');
//   const videoRef = useRef(null);

//   const makePhoto = () => {
//     const photo = videoRef.current.getScreenshot();
//     const link = document.createElement('a');
//     link.download = 'photo.png';
//     link.href = photo;
//     link.click();
//   };

//   return (
//     <>
//       {isEnabled && (
//         <Webcam
//           ref={videoRef}
//           audio={false}
//           mirrored={facing === 'user' ? true : false}
//           className={facing === 'user' ? 'mirror' : ''}
//           videoConstraints={{
//             facingMode: { exact: facing },
//           }}
//           onUserMediaError={(error) => setError(error.name)}
//           onUserMedia={(error) => setError(null)}
//           screenshotFormat="image/jpeg"
//           screenshotQuality={1}
//         />
//       )}
//       {error && <div className="error">{error}</div>}
//       {isEnabled && <h1>{facing === 'user' ? 'Front Cam' : 'Back Cam'}</h1>}
//       <div className="controls">
//         <button onClick={() => setEnabled(!isEnabled)}>
//           {isEnabled ? 'Off' : 'ON'}
//         </button>
//         <button
//           onClick={() => setFacing(facing === 'user' ? 'environment' : 'user')}
//         >
//           <Facingicon />
//         </button>
//         <button onClick={() => makePhoto()}>
//           <PhotoIcon />
//         </button>
//       </div>
//     </>
//   );
// }

// export default CameraComponent;

// import React, { useRef, useState, useEffect } from 'react';
// import { ReactComponent as Facingicon } from './facingIcon.svg';
// import { ReactComponent as PhotoIcon } from './photoIcon.svg';
// import '../App.css';
// import Webcam from 'react-webcam';

// function CameraComponent() {
//   const [error, setError] = useState(null);
//   const [isEnabled, setEnabled] = useState(false);
//   const [facing, setFacing] = useState('user');
//   const videoRef = useRef(null);

//   useEffect(() => {
//     if (isEnabled) {
//       navigator.mediaDevices
//         .enumerateDevices()
//         .then((devices) => {
//           const videoDevices = devices.filter(
//             (device) => device.kind === 'videoinput'
//           );
//           if (videoDevices.length < 2) {
//             setFacing('user');
//           }
//         })
//         .catch((err) => {
//           console.error(err);
//           setError('Error accessing media devices.');
//         });
//     }
//   }, [isEnabled]);

//   const makePhoto = () => {
//     const photo = videoRef.current.getScreenshot();
//     const link = document.createElement('a');
//     link.download = 'photo.png';
//     link.href = photo;
//     link.click();
//   };

//   return (
//     <>
//       {isEnabled && (
//         <Webcam
//           ref={videoRef}
//           audio={false}
//           mirrored={facing === 'user'}
//           className={facing === 'user' ? 'mirror' : ''}
//           videoConstraints={{
//             facingMode: facing,
//           }}
//           onUserMediaError={(error) => setError(error.message)}
//           onUserMedia={() => setError(null)}
//           screenshotFormat="image/jpeg"
//           screenshotQuality={1}
//         />
//       )}
//       {error && <div className="error">{error}</div>}
//       {isEnabled && <h1>{facing === 'user' ? 'Front Cam' : 'Back Cam'}</h1>}
//       <div className="controls">
//         <button onClick={() => setEnabled(!isEnabled)}>
//           {isEnabled ? 'Off' : 'ON'}
//         </button>
//         <button
//           onClick={() => setFacing(facing === 'user' ? 'environment' : 'user')}
//         >
//           <Facingicon />
//         </button>
//         <button onClick={makePhoto}>
//           <PhotoIcon />
//         </button>
//       </div>
//     </>
//   );
// }

// export default CameraComponent;

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ReactComponent as Facingicon } from './facingIcon.svg';
import { ReactComponent as PhotoIcon } from './photoIcon.svg';
import { ReactComponent as Circle } from './circle.svg';
import '../App.css';
import Webcam from 'react-webcam';

function CameraComponent() {
  const [error, setError] = useState(null);
  const [isEnabled, setEnabled] = useState(false);
  const [facing, setFacing] = useState('user');
  const [photos, setPhotos] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isEnabled) {
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          const videoDevices = devices.filter(
            (device) => device.kind === 'videoinput'
          );
          if (videoDevices.length < 2) {
            setFacing('user');
          }
        })
        .catch((err) => {
          console.error(err);
          setError('Error accessing media devices.');
        });
    }
  }, [isEnabled]);

  const makePhoto = useCallback(() => {
    if (videoRef.current) {
      const photo = videoRef.current.getScreenshot();
      if (photo) {
        setPhotos((prevPhotos) => [...prevPhotos, photo]);
      }
      setEnabled(false);
    }
  }, [videoRef]);

  return (
    <>
      <div className="camera-container">
        {!isEnabled ? (
          <>
            <div className="photos-container">
              {photos.map((photo, index) => (
                <div key={index} className="photo-wrapper">
                  <img src={photo} alt={`photo-${index}`} className="photo" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <Webcam
              ref={videoRef}
              audio={false}
              mirrored={facing === 'user'}
              className={facing === 'user' ? 'mirror' : ''}
              videoConstraints={{
                facingMode: facing,
              }}
              onUserMediaError={(error) => setError(error.message)}
              onUserMedia={() => setError(null)}
              screenshotFormat="image/jpeg"
              screenshotQuality={1}
            />
            <button onClick={makePhoto} className="button">
              Take Photo
            </button>
          </>
        )}
        {error && <div className="error">{error}</div>}
        {isEnabled && <h1>{facing === 'user' ? 'Front Cam' : 'Back Cam'}</h1>}
        <div className="controls">
          <button onClick={() => setEnabled(!isEnabled)}>
            {isEnabled ? 'Off' : 'ON'}
          </button>
          {/* <button
            onClick={() =>
              setFacing(facing === 'user' ? 'environment' : 'user')
            }
          >
            <Facingicon />
          </button>
          <button onClick={makePhoto}>
            <Circle />
          </button> */}
        </div>
        {isEnabled && (
          <div className="takePhoto">
            <button onClick={makePhoto}>
              <Circle />
            </button>
            <button
              onClick={() =>
                setFacing(facing === 'user' ? 'environment' : 'user')
              }
            >
              <Facingicon />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CameraComponent;
