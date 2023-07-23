import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getImages } from '../../utils/getDataFunctions';
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import { toast } from 'react-toastify';
import { StyledDocViewer } from '../../pages/requestDetails/StyledElements';
import facesheet from '../../assets/facesheet.png';
import aob from '../../assets/aob.png';
import pcs from '../../assets/pcs.png';
import other from '../../assets/other.png';

function DocViewerComponent() {
  const runNo = +window.location.pathname.substring(17);
  const [index, setIndex] = useState(0);
  const handleClick = (e) => {
    const index = +e.target.id; // to convert id into int;
    setIndex(index);
  };

  const [docs, setDocs] = useState([{ uri: '', type: 'other' }]);

  useEffect(() => {
    async function getData() {
      const { ans, res } = await getImages(runNo);
      if (res.status === 200) {
        formateImageData(ans.data);
      } else {
        toast.error(ans.message);
      }
    }
    getData();
  }, []);

  const formateImageData = (data) => {
    const images = [];
    for (const key in data) {
      let img;
      if (data[key] !== null) {
        switch (key) {
          case 'faceSheet':
            img = { type: 'Facesheet', uri: data[key] };
            images.push(img);
            break;
          case 'pcs':
            img = { type: 'PCS', uri: data[key] };
            images.push(img);
            break;
          case 'aob':
            img = { type: 'AOB', uri: data[key] };
            images.push(img);
            break;
          case 'other1':
            img = { type: 'Doc-1', uri: data[key] };
            images.push(img);
            break;
          case 'other2':
            img = { type: 'Doc-2', uri: data[key] };
            images.push(img);
            break;
          case 'other3':
            img = { type: 'Doc-3', uri: data[key] };
            images.push(img);
            break;
          case 'other4':
            img = { type: 'Doc-4', uri: data[key] };
            images.push(img);
            break;
          default:
            break;
        }
      }
    }
    if (images.length !== 0) {
      setDocs(images);
    }
  };
  const docImages = (doc) => {
    switch (doc.type) {
      case 'Facesheet':
        return facesheet;
      case 'AOB':
        return aob;
      case 'PCS':
        return pcs;
      default:
        return other;
    }
  };

  const buttons = docs.map((doc, i) => {
    const docImg = docImages(doc);
    return (
      <button
        key={i}
        className="docBtn"
        value={i}
        onClick={handleClick}
        id={i}
        data-testid={`imgBtn${i}`}
      >
        <img src={docImg} alt={doc.type} className="docBtnImage" id={i} />
        <p id={i}>{doc.type}</p>
      </button>
    );
  });
  return (
    <>
      <div className="docViewer-imageControls">
        <div className="docViewer-actions"></div>
        <div className="docViewer-main-wrapper">
          <StyledDocViewer>
            <div className="docViewer-main">
              <ReactPanZoom image={docs[index].uri} alt="document image" />
            </div>
          </StyledDocViewer>
        </div>
      </div>
      <div className="docViewer-options">{buttons}</div>
    </>
  );
}

DocViewerComponent.propTypes = {
  docs: PropTypes.array,
};

export default DocViewerComponent;
