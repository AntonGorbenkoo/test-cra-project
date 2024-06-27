import React, { useRef, useState } from 'react';
import { ReactComponent as Facingicon } from './facingIcon.svg';
import { ReactComponent as PhotoIcon } from './photoIcon.svg';
import '../App.css';
import Webcam from 'react-webcam';

function CameraComponent() {
  const [error, setError] = useState();
  const [isEnabled, setEnabled] = useState(false);
  const [facing, setFacing] = useState('user');
  const videoRef = useRef(null);

  const makePhoto = () => {
    const photo = videoRef.current.getScreenshot();
    const link = document.createElement('a');
    link.download = 'photo.png';
    link.href = photo;
    link.click();
  };

  return (
    <>
      {isEnabled && (
        <Webcam
          ref={videoRef}
          audio={false}
          mirrored={facing === 'user' ? true : false}
          className={facing === 'user' ? 'mirror' : ''}
          videoConstraints={{
            facingMode: { exact: facing },
          }}
          onUserMediaError={(error) => setError(error.name)}
          onUserMedia={(error) => setError(null)}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
        />
      )}
      {error && <div className="error">{error}</div>}
      {isEnabled && <h1>{facing === 'user' ? 'Front Cam' : 'Back Cam'}</h1>}
      <div className="controls">
        <button onClick={() => setEnabled(!isEnabled)}>
          {isEnabled ? 'Off' : 'ON'}
        </button>
        <button
          onClick={() => setFacing(facing === 'user' ? 'environment' : 'user')}
        >
          <Facingicon />
        </button>
        <button onClick={() => makePhoto()}>
          <PhotoIcon />
        </button>
      </div>
    </>
  );
}

export default CameraComponent;
