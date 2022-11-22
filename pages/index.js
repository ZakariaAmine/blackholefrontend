import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import HomePage from '../components/pages/home'
import SliderMainHome from '../components/components/SliderMainHome';
import Roadmap from '../components/components/Roadmap'
import TreeRoadmap from '../components/components/TreeRoadmap'
import axios from 'axios'
import BiddyHeader from '../components/menu/BiddyHeader';
import StarryGalaxy from '../components/components/StarryGalaxy';
import constants from '../src/constants';
import Reveal from 'react-awesome-reveal';
import { fadeIn } from '../lib/CssHelper'
import Footer from '../components/components/footer';
import BlackholeHeader from '../components/menu/BlackholeHeader';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import HeaderMetaTags from '../components/components/HeaderMetaTags';


export default function Home() {
  // const [nftListings, setNftListings] = useState([]);
  useEffect(() => {
    

    
// const { balance } = response

  //   axios.get(constants.API_URL + '/api/nft_listings').then(response => {
  //     setNftListings(response.data)
  //   })
  //   // Update the document title using the browser API
  }, []);

  return (
    <div>
      <Head>
        <title>BlackHole | Cleaning Digital Space</title>
        <HeaderMetaTags />
      </Head>
      
      
      <StarryGalaxy />
      
      
      <section className='container' style={{marginTop: -50}}>
        <BlackholeHeader />
        <SliderMainHome />
      </section>
      <section>
        <Reveal className='onStep' keyframes={fadeIn} delay={1000} duration={1000} triggerOnce>
          <h2 className="col-white" style={{textAlign: 'center' }} >
            Upcoming Missions
          </h2>
        </Reveal>
        <TreeRoadmap />
      </section>

      
      <Footer />

    </div>
  )
}
