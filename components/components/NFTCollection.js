import React, { useEffect, useState, useContext } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import axios from "axios";
import { Modal } from "react-bootstrap";
import EmailIcon from '@mui/icons-material/Email';
import WebIcon from '@mui/icons-material/Web';
import { toast } from "react-toastify";
import { FaDiscord, FaTelegramPlane, FaInstagram } from 'react-icons/fa';
import DescriptionIcon from '@mui/icons-material/Description';
import NFTSlider from "./NFTSlider";
import { copyToClipboard, getLongAddress, getShortAddress } from "../../utils/conversion";
import { config } from "../../src/constants";
import api, { getAvatar } from "../../src/api";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { AppContext } from "../../utils/context";

export default function NFTCollection() {
  const { userInfo } = useContext(AppContext);
  const [refresh, setRefresh] = useState(false);
  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [adminCollections, setAdminCollections] = useState([]);

  useEffect(() => {
    (async () => {
      await fetchAdminCollections();
    })()
  }, []);

  const fetchAdminCollections = async () => {
    const url = `${config.DATA_LAYER}/collections?creator=${config.ADMIN_ADDRESS}`;
    try {
      const resp = await axios.get(url + `&skip=0&limit=1`, {
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      });
      const count = resp.data.result.count;
      const resp2 = await axios.get(url + `&limit=${count}&sortBy=updated_at&order=desc`, {
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      });
      const resp3 = await axios.get(`${api.baseUrl}${api.collection}/findAll`);
      const artists = resp3.data;
      const list = resp2.data.result.list;
      let collections = [];
      list.map((item) => {
        if (item.id !== config.ACE_DENOMID) {
          let data = item;
          let found = artists.find(element => item.id === element.denomId);
          if (found) {
            data.artist = found.artist;
          }
          collections.push(data);
        }
      });
      setAdminCollections(collections);
      setRefresh(!refresh);
    } catch (error) {
      console.log('Fetch Admin Collections error : ', error);
    }
  }

  const handleCopy = (e, data) => {
    copyToClipboard(data);

    e.stopPropagation();
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleClose = () => {
    setShow(false);
  }

  const onClickUser = (artist) => {
    setSelectedUser(artist);
    setShow(true);
  }

  const onClaim = async (denomId, name) => {
    if (!userInfo || (userInfo && !userInfo.user_id)) {
      toast.warning("You need to register profile.");
      return;
    }
    const params = {
      denomId,
      name,
      artist: userInfo.user_id
    };
    await axios({
      method: "put",
      url: `${api.baseUrl}${api.collection}/${denomId}`,
      data: params
    })
    await fetchAdminCollections();
  }

  const renderSlides = () =>
    adminCollections?.length > 0 && adminCollections?.map((collection, index) => {
      return (
        <div key={index}>
          <div className="d-md-flex justify-content-between align-items-center mt-4">
            <div className="text-center" style={{ width: '15%' }}>
              <div className="collection_pic" onClick={() => onClickUser(collection.artist)}>
                <span className="collection_pic_info">
                  <span className="collection_pic_title">{collection.artist && collection.artist.username}</span>
                  <span className="collection_pic_by">{collection.artist && getShortAddress(collection.artist.address, true)}</span>
                </span>
                <div className="collection_pic_wrap">
                  <Image
                    className="lazy img-fluid"
                    src={getAvatar(collection.artist)}
                    alt={collection.artist?.username}
                    width={300}
                    height={300}
                    objectFit="contain"
                  />
                </div>
              </div>
            </div >

            <div
              className="gallery-slider-wrap"
              style={{ width: '80%' }}
            >
              <NFTSlider denomId={collection.id} name={collection.name} claimed={collection.artist?.username} onClaim={onClaim}></NFTSlider>
            </div>
          </div >
        </div>
      )
    });
  return (
    <div className="col-md-12">
      {renderSlides()}
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        {selectedUser && (
          <Modal.Body className="text-center container">
            <div className="row">
              <div className="col-md-12 position-relative">
                <div className="artist_banner">
                  <Image
                    className="lazy img-fluid"
                    src={selectedUser.banner ? api.imgUrl + selectedUser.banner : "/img/background/1.jpg"}
                    alt={selectedUser.username}
                    width="100%"
                    height="400px"
                  />
                </div>
                <div className="artist_info">
                  <h2 className="artist_name">{selectedUser.username}</h2>
                  <h4 className="artist_address" onClick={(e) => handleCopy(e, selectedUser.address)}>
                    <span className={copied ? 'profile_wallet blur' : 'profile_wallet'}> {getLongAddress(selectedUser.address)}</span>
                    <ContentCopyIcon />
                    {copied && (
                      <span className="copied">Copied!</span>
                    )}
                  </h4>
                </div>
              </div>
              <div className="col-md-4 position-relative">
                <div className="artist_avatar">
                  <Image
                    src={getAvatar(selectedUser)}
                    alt={selectedUser.username}
                    width="150px"
                    height="150px"
                    radius="50%"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div className="col-md-8">
                <div className="row mt-4">
                  <div className="col-md-4 text-label">
                    <span className="de-flex justify-content-start align-items-center gap-1">
                      <EmailIcon />
                      <span>Email:</span>
                    </span>
                  </div>
                  <div className="col-md-8 text-label">
                    <span className="text-desc">{selectedUser.email}</span>
                  </div>
                  <div className="col-md-4 text-label">
                    <span className="de-flex justify-content-start align-items-center gap-1">
                      <FaDiscord />
                      <span>Discord:</span>
                    </span>
                  </div>
                  <div className="col-md-8 text-label">
                    <a href={selectedUser.discord} className="text-desc" target='_blank' rel="noreferrer">{selectedUser.discord}</a>
                  </div>
                  <div className="col-md-4 text-label">
                    <span className="de-flex justify-content-start align-items-center gap-1">
                      <FaTelegramPlane />
                      <span>Telegram:</span>
                    </span>
                  </div>
                  <div className="col-md-8 text-label">
                    <a href={selectedUser.telegram} className="text-desc" target='_blank' rel="noreferrer">{selectedUser.telegram}</a>
                  </div>
                  <div className="col-md-4 text-label">
                    <span className="de-flex justify-content-start align-items-center gap-1">
                      <FaInstagram />
                      <span>Instagram:</span>
                    </span>
                  </div>
                  <div className="col-md-8 text-label">
                    <a href={selectedUser.instagram} className="text-desc" target='_blank' rel="noreferrer">{selectedUser.instagram}</a>
                  </div>
                  <div className="col-md-4 text-label">
                    <span className="de-flex justify-content-start align-items-center gap-1">
                      <WebIcon />
                      <span>Website:</span>
                    </span>
                  </div>
                  <div className="col-md-8 text-label">
                    <a href={selectedUser.website} className="text-desc" target='_blank' rel="noreferrer">{selectedUser.website}</a>
                  </div>

                  <div className="col-md-4 text-label">
                    <span className="de-flex justify-content-start align-items-center gap-1">
                      <DescriptionIcon />
                      <span>Description:</span>
                    </span>
                  </div>
                  <div className="col-md-8 text-label">
                    <span className="text-desc">{selectedUser.userBio}</span>
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
        )}

        <Modal.Footer>
          <div className="container de-flex justify-content-end">
            <button className="btn-main" onClick={handleClose}>
              Go Back
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
