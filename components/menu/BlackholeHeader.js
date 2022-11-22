/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useEffect, useContext, useState, useRef } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { header } from 'react-bootstrap';
import Link from 'next/link'
import useOnclickOutside from "react-cool-onclickoutside";
import { FaTwitter, FaTelegramPlane } from "react-icons/fa";
import { config } from "../../src/constants";
import { CSSTransition } from "react-transition-group";
import BlackholeWallet from "../components/BlackholeWalletProfile";
import { AppContext } from "../../utils/context";

export default function Header() {
  const [isNavVisible, setNavVisibility] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { connectAndGetBalance } = useContext(AppContext);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    mediaQuery.addListener(handleMediaQueryChange);
    handleMediaQueryChange(mediaQuery);
    connectAndGetBalance();
    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const handleMediaQueryChange = mediaQuery => {
    if (mediaQuery.matches) {
      setIsSmallScreen(true);
    } else {
      setIsSmallScreen(false);
    }
  };

  const toggleNav = () => {
    setNavVisibility(!isNavVisible);
  };

  const logoSize = 25

  return (
    <header className="Header">
      <Link className='header-link' href="/">
        <img src="../img/logo10.png" style={{cursor: 'pointer' }}className="Logo" alt="logo" />
      </Link>
      <CSSTransition
        in={!isSmallScreen || isNavVisible}
        timeout={350}
        classNames="NavAnimation"
        unmountOnExit
      >
        <nav className="Nav">
          <Link className='header-link' href="/">
            Home
          </Link>
          <Link className='header-link' href="/">
            Drops
          </Link>
          <Link className='header-link' href="/voting">
            Vote
          </Link>
          <Link className='header-link' href="/profile">
            Profile
          </Link>
          <Link className='header-link' href="/nfts">
            My NFTs
          </Link>
          {/* <Link className='header-link' href="https://linktr.ee/blackholeonjuno">
            Links
          </Link>
          <Link className='header-link' href="./V1_BLACKHOLE_LLC_WHITEPAPER.pdf" download="V1_BLACKHOLE_LLC_WHITEPAPER" target="_blank" >
            Whitepaper
          </Link> */}
          <div style={{display:'flex', flexDirection: 'row'}}>
            <div className="social-icons">
            <a rel="noreferrer" href='https://twitter.com/BlackHoleLLC' target="_blank">
                                <FaTwitter size={logoSize} />
            </a>
            </div>
            <div className="social-icons">
            <a rel="noreferrer" href='https://discord.com/invite/pY6cj2vNJD' target="_blank">
                                <img src={'/img/Discord-Logo-White.png'} style={{width: logoSize}} />
                            </a>
            </div>
            <div className="social-icons">
            <a rel="noreferrer" href='https://t.me/HoleChat' target="_blank">
                                <img src={'/img/telegram2.png'} style={{width: logoSize}} />
                            </a>
            </div>
          </div>
          <BlackholeWallet />
          {/* <button>Logout</button> */}
        </nav>
      </CSSTransition>
      
      <button onClick={toggleNav} className="Burger">
        ☰
      </button>
    </header>
  );
}
