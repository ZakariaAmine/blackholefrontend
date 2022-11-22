import React, { useState, useRef } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
// import '../src/stylesheets/App.css'
import HomePage from '../components/pages/home'
import PollResultsTable from '../components/components/PollResultsTable'
import DonutChartPollResults from '../components/components/DonutChartPollResults'

import PollOption from '../components/components/PollOption'
import StarryGalaxy from '../components/components/StarryGalaxy'

import Collection from '../components/pages/colection'
import axios from 'axios'
import BiddyHeader from '../components/menu/BiddyHeader';
import BlackholeHeader from '../components/menu/BlackholeHeader';
import constants, { config } from '../src/constants';
import Countdown from 'react-countdown';
import Footer from '../components/components/footer';
import SliderVoting from '../components/components/SliderVoting'
import HowVotingWorks from '../components/components/HowVotingWorks'
import FancyCountdown from '../components/components/FancyCountdown'
import Reveal from 'react-awesome-reveal';
import { fadeIn, fadeInUp, grow, customStyles } from '../lib/CssHelper'
import { getBalance, getKeplr } from '../lib/CosmosHelper'
import BlackholeWallet from '../components/components/BlackholeWallet'
import ReactDOM from 'react-dom';
import Modal from 'react-modal';// import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { useRouter } from "next/router";
import lscache from 'lscache';
import HeaderMetaTags from '../components/components/HeaderMetaTags';

export async function getServerSideProps(context) {
  // const pollid = context.params.pollid;
  // console.log('pollid', pollid)
  // const { nftid } = router.query
  // console.log(constants.API_URL + `/api/polls/`)
  console.log(context)
  const res = await fetch(constants.API_URL + `/api/current_poll/`)
  // console.log('res', res)
  const data = await res.json()
  //   const nft = data[0];
  //   if (!data) {
  //     return {
  //       notFound: true,
  //     }
  //   }


  return {
    props: { pollCampaign: data }, // will be passed to the page component as props
  }
}


export default function Voting(props) {


  const [showCongratsVoting, setShowCongratsVoting] = useState(false);
  const [votingPromptMessage, setVotingPromptMessage] = useState("");
  const testDivRef = useRef(null);
  const votingRef = useRef(null);
  const votingMessageRef = useRef(null);
  const [modalIsOpen, setIsOpen] = useState(false);

  let subtitle;

  console.log('key', lscache.get('voting_key'));

  const votingKey = lscache.get('voting_key');

  console.log('key2', votingKey);


  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    document.body.style.overflow = 'hidden';
    const box = document.getElementById('keplr-logo');
    // const box2 = document.getElementById('main-logo');
    // 👇️ removes element from DOM
    box.style.visibility = 'hidden';
    // box2.style.visibility = 'hidden';

    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    document.body.style.overflow = 'unset';
    const box = document.getElementById('keplr-logo');
    // const box2 = document.getElementById('main-logo');
    // 👇️ removes element from DOM
    box.style.visibility = 'visible';
    // box2.style.visibility = 'visible';    
    setIsOpen(false);
  }
  if (props.pollCampaign.error) {
    return <div>No Polls currently upcoming or active</div>
  }


  const closeMessage = () => { testDivRef.current.scrollIntoView(); setShowCongratsVoting(false); }

  const castVote = async (pollOptionId) => {
    console.log('pollOptionId', pollOptionId)
    if (!votingKey) {
      // alert("you need to register email to vote.")
      votingRef.current.scrollIntoView();
      setVotingPromptMessage("You must first register email in order to vote.")
      return
    }

    var keplr = await getKeplr()
    if (keplr === undefined) {
      alert("Please install keplr. To continue.")
      window.open("https://www.keplr.app/", '_blank').focus();
      return
    }
    console.log(keplr)
    const chainId = config.CHAIN_ID;

    // // Enabling before using the Keplr is recommended.
    // // This method will ask the user whether to allow access if they haven't visited this website.
    // // Also, it will request that the user unlock the wallet if the wallet is locked.

    try {
      await keplr.enable(chainId);
      console.log('keplr')
    }
    catch (err) {
      console.log(err)
      alert("Please Sign up for Keplr");
      return
    }
    const offlineSigner = window.keplr.getOfflineSigner(chainId);
    // // It can return the array of address/public key.
    // // But, currently, Keplr extension manages only one address/public key pair.
    // // XXX: This line is needed to set the sender address for SigningCosmosClient.
    const accounts = await offlineSigner.getAccounts();
    //https://lcd-juno.cosmostation.io/cosmos/bank/v1beta1/balances/juno1dru5985k4n5q369rxeqfdsjl8ezutch8y9vuau?pagination.limit=1000
    //use juno tools api to find balance
    // const balances = await axios.get(`https://lcd-juno.cosmostation.io/cosmos/bank/v1beta1/balances/${accounts[0].address}?pagination.limit=1000`)


    console.log('accounts', accounts)
    const address = accounts[0].address
    const balance = await getBalance(address);
    // const balancePairs = balances.data.balances
    // const json = await balances.json()
    // console.log('accounts', accounts)
    // console.log('balances', balancePairs);
    // var voting_balance = 0;
    console.log('balance', balance)
    // for (var i = 0; i < balancePairs.length; i++){
    //   const pair = balancePairs[i];
    //   if (pair.denom == "ujuno"){
    //     voting_balance = pair.amount
    //   }
    // }

    // // Initialize the gaia api with the offline signer that is injected by Keplr extension.
    // const cosmJS = new SigningCosmosClient(
    //     "https://lcd-cosmoshub.keplr.app",
    //     accounts[0].address,
    //     offlineSigner,
    // );
    // const title = document.getElementById("description").value;

    if (balance == 0) {
      alert("You must hold HOLE to vote. Get it on Junoswap soon or see our Token drop page to earn HOLE. ")
      return
    }

    var formObj = {
      voting_balance: balance,
      address: accounts[0].address,
      poll_campaign_id: pollCampaign.id,
      poll_option_id: pollOptionId,
      voting_key: votingKey,
    }
    console.log('formObj', formObj)
    axios.post(constants.API_URL + '/api/poll_responses/', formObj).then(response => {
      if (response.data.error) {
        alert(response.data.error)
      }
      else {
        setShowCongratsVoting(true)
        votingMessageRef.current.scrollIntoView();
        // alert("Thank you for your response! See the preliminary results below.")
        // window.location.reload();
      }
    })
  }
  const poll = props.pollCampaign.poll
  const pollCampaign = props.pollCampaign
  // const [nftListings, setNftListings] = useState([]);


  const endTime = Date.parse(poll.end_time)
  const startTime = Date.parse(poll.start_time)
  console.log('endTime', pollCampaign.end_time)
  console.log('startTime', pollCampaign.start_time)

  let pollMessage = "Time till poll Ends"
  if (Date.parse(pollCampaign.start_time) > Date.parse(new Date())) {
    pollMessage = "Time till poll Begins"
  }
  // 
  // poll.active = 
  return (
    <div>
      <Head>
        <title>BlackHole | Cleaning Digital Space</title>
        <HeaderMetaTags />
        <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
      </Head>
      <StarryGalaxy />
      <section ref={votingRef} className='container' style={{ marginTop: -50 }}>
        <BlackholeHeader />
        {!votingKey &&
          <HowVotingWorks message={votingPromptMessage} />
        }
      </section>
      {votingKey &&
        <BlackholeWallet />
      }
      <section className='container' style={{ padding: 10, marginTop: 30 }}>
        <div className='row'>

          <div>
            <div className='links-container' >
              {votingKey &&
                <Reveal style={{ margin: 'auto' }} className='onStep' keyframes={fadeIn} delay={0} duration={600} triggerOnce >
                  <span className='btn-blue btn-main inline lead bg-blue' style={{ margin: 'auto' }}>Get on Osmosis (Coming Soon)</span>
                  <span onClick={openModal} className='btn-main inline lead' style={{ margin: 'auto', cursor: 'pointer', zIndex: 9999999 }} >How Voting Works</span>
                  <span className='btn-blue btn-main inline lead bg-blue' style={{ margin: 'auto' }}>Get HOLE on Junoswap (Coming Soon)</span>
                </Reveal>
              }
              {!votingKey &&
                <Reveal style={{ margin: 'auto' }} className='onStep' keyframes={fadeIn} delay={0} duration={600} triggerOnce >
                  <span className='btn-main inline lead bg-blue' style={{ margin: 'auto' }}>Get HOLE on Osmosis (Coming Soon)</span>
                  <span className='btn-main inline lead bg-blue' style={{ margin: 'auto' }}>Get HOLE on Junoswap (Coming Soon)</span>
                </Reveal>
              }
            </div>
          </div>
        </div>
      </section>

      <section className='container' style={{ padding: 10, marginTop: 30 }}>
        <div className='col-lg-12' style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 55 }}>
            <h4 className='col-white' style={{ textAlign: 'center', marginTop: 20 }}>
              {pollMessage}
            </h4>
          </div>
          <FancyCountdown pollCampaign={pollCampaign} />
          <div>

            {pollCampaign.is_current_poll &&
              <div className='col-white' style={{ textAlign: 'center', marginTop: 20, marginBottom: 100 }}>
                Vote with your Blackhole Token on what to burn Below Before the Poll Window Closes!
              </div>
            }
            {!pollCampaign.is_current_poll &&
              <div className='col-white' style={{ textAlign: 'center', marginTop: 20, marginBottom: 100 }}>
                Get your HOLE before and be ready for the voting window to open.
              </div>
            }
          </div>
        </div>
      </section>
      <section className="container" style={{ padding: 10 }} >
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {/* <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2> */}
          {/* <div>I am a modal</div> */}
          <SliderVoting />
          <button style={{ padding: '6px 20px' }} onClick={closeModal}>
            sounds good
          </button>
        </Modal>

        <div className='row' ref={votingMessageRef} >
          <div className='col-lg-12'>
            <div>
            </div>
            <div style={{ display: showCongratsVoting ? 'inline' : 'none' }} >
              <Reveal className='onStep' keyframes={grow} delay={0} duration={500} triggerOnce >
                <div onClick={closeMessage} style={{ marginTop: 30 }} className="alert fade alert-simple alert-success alert-dismissible text-left font__family-montserrat font__size-16 font__weight-light brk-library-rendered rendered show">
                  <strong className="font__weight-semibold">Thank you!</strong> We have received your response. Refresh page to see the preliminary results below...
                </div>
              </Reveal>
            </div>
            <div className='poll-opts-container' >
              {pollCampaign.is_current_poll && pollCampaign.results.poll_options.map((pollOption, index) =>
                <Reveal key={index} className='onStep' keyframes={grow} delay={index * 200} duration={1300} triggerOnce >
                  <PollOption key={index} pollOption={pollOption} castVote={castVote} />
                </Reveal>
              )}
              {!pollCampaign.is_current_poll && pollCampaign.results.poll_options.map((pollOption, index) =>
                <Reveal key={index} className='onStep' keyframes={grow} delay={index * 200} duration={1300} triggerOnce >
                  <PollOption toolTipText="Preview Only" key={index} pollOption={pollOption} castVote={() => null} />
                </Reveal>
              )}
            </div>
          </div>
        </div>
      </section>
      {pollCampaign.is_current_poll &&
        <section className="container" style={{ padding: 10 }} ref={testDivRef} >
          <div className='row'>
            <Reveal className='onStep' keyframes={fadeInUp} delay={0} duration={600} triggerOnce >
              <h3 className='col-white' style={{ textAlign: 'center', marginTop: 50 }}>
                Current Results
              </h3>
              <DonutChartPollResults pollResults={pollCampaign.results} />
            </Reveal>
          </div>

        </section>
      }
      <Footer />
    </div>
  )
}
