import React from 'react'
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';
import Footer from '../components/Footer';


const LandingPage = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <Features/>
    <Reviews/>
    <Contact/>
    <Footer/>
    </>
  )
}

export default LandingPage;