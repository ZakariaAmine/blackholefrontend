import React, { useContext, useState } from "react";
import Image from "next/image";
import { AppContext } from "../../utils/context";
import axios from "axios";
import { useEffect } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Slider from './OwlCarousel';
import { config } from "../../src/constants";
import api from '../../src/api';

export default function GallerySlider({ id = '', nftCount = 0, owner = '' }) {
  const { setNFTShow, setNFT, refreshGallery } = useContext(AppContext);
  const [nftsList, setNFTsList] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    (async () => {
      await fetchNFTs();
    })()
  }, [refreshGallery]);

  const handleClick = (nft) => {
    setNFT(nft);
    setNFTShow(true);
  };

  const fetchNFTs = async () => {
    try {
      const url = `${config.DATA_LAYER}/nfts?owner=${owner}`;
      const resp = await axios.get(url + `&skip=0&limit=1`, {
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      });
      const count = resp.data.result.count;
      if (count !== nftCount) {
        await axios({
          method: "post",
          url: `${api.baseUrl}${api.user}/${id}`,
          data: {
            count
          }
        })
        console.log(id, count, nftCount)
        console.log(`Updated the ${owner} nft count`)
        if (count === 0) return;
      }
      const resp2 = await axios.get(url + `&limit=${count}&sortBy=updated_at&order=desc`, {
        headers: {
          Accept: 'application/json, text/plain, */*'
        }
      });
      setNFTsList(resp2.data.result.list)
      setRefresh(!refresh);
    } catch (error) {
      console.log('Fetch User NFTs error : ', error);
    }
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
      <Slider lazyLoad={true} nav={true} dots={false} autoWidth={true}>{renderSlides()}</Slider>
    </div>
  );
}
