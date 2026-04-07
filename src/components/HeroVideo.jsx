// Hero Video Component for R&S Jewellery
import React, { useState, useEffect } from 'react';

const HeroVideo = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Preload video
    const video = document.createElement('video');
    video.src = '/videos/jewellery-hero.mp4';
    video.onloadeddata = () => setVideoLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="/videos/jewellery-hero-poster.jpg"
        >
          <source src="/videos/jewellery-hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">
            R&S Jewellery
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in-delay">
            Exquisite Collections Since 2024
          </p>
          <div className="space-x-4 animate-fade-in-delay-2">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
              Shop Now
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-black px-8 py-3 rounded-lg font-semibold transition-all">
              View Collection
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading beautiful jewellery...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroVideo;
