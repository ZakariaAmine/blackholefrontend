import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import axios from 'axios';
import { AppContext } from "../../utils/context";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Slider from './OwlCarousel';
import { isEmpty } from "../../utils/conversion";
import { config } from "../../src/constants";
import { toast } from "react-toastify";

export default function NFTSlider({ denomId = '', name = '', claimed, onClaim }) {
  const { setNFTShow, setNFT, fetchArtist, walletInfo } = useContext(AppContext);
  const [nftsList, setNFTsList] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [artist, setArtist] = useState(false);

  useEffect(() => {
    (async () => {
      if (!isEmpty(denomId)) {
        await fetchNFTs(denomId);
      }
    })()
  }, [denomId]);

  useEffect(() => {
    (async () => {
      if (walletInfo && walletInfo.address) {
        const resp = await fetchArtist(walletInfo.address);
        setArtist(resp);
      }
    })()
  }, [walletInfo])

  const fetchNFTs = async (denomId) => {
    if (denomId === '') return;
    const url = `${config.DATA_LAYER}/nfts?denomId=${denomId}`;
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
      setNFTsList(resp2.data.result.list);
      setRefresh(!refresh);
    } catch (error) {
      console.log('Fetch NFTs error : ', error);
    }
  }

  const handleClick = (nft) => {
    setNFT(nft);
    setNFTShow(true);
  };

  const handleClaim = async () => {
    if (!artist) {
      toast.warning("You can't claim this collection because you aren't an artist.");
      return;
    }
    await onClaim(denomId, name);
  }

  const renderSlides = () =>
    nftsList?.length > 0 && nftsList?.map((nft, index) => (
      <div className="item" key={index}>
        <div className="nft_pic">
          <span className="nft_pic_info" onClick={(e) => handleClick(nft)}>
            <span className="nft_pic_title">{nft.name}</span>
          </span>
          {nft.list && (
            <span className="list_icon">
              <VisibilityIcon />
            </span>
          )}
          <div className="nft_pic_wrap">
            {
              nft.preview_uri && (
                <Image
                  className="lazy img-fluid"
                  src={nft.preview_uri}
                  alt={nft.name}
                  width={300}
                  height={300}
                />
              )
            }
          </div>
        </div>
      </div>
    ));

  return (
    <div className="nft-big">
      <div className="collection_title">
        <span className="text-white">{name}</span>
        {claimed ? (
          <button className="btn-main color-1" disabled>Claimed</button>
        ) : (
          <button className="btn-main color-1" onClick={handleClaim}>Claim</button>
        )}
      </div>
      <Slider lazyLoad={true} nav={true} dots={false} autoWidth={true}>{renderSlides()}</Slider>
    </div>
  );
}
