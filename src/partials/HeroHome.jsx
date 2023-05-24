import React, { useState } from "react";
import Modal from "../utils/Modal";

import HeroImage from "../images/hero-image-01.jpg";
import Banner from "../images/banner-bg.png";
import Astronaut from "../images/Astronaut.png";
import { Link } from "react-router-dom";

function HeroHome() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section>
      <div
        className="w-full md:h-screen sm:px-6 relative bg-cover object-cover"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        {/* Hero content */}
        <div className="relative pt-32 pb-10 md:pt-72 md:pb-16">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h1 mb-4" data-aos="fade-up">
              Collaborative Learning
            </h1>
            <p
              className="text-xl text-gray-400 mb-8"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Collaborative Learning is a platform designed to facilitate the
              sharing of knowledge, skills, and ideas among a community of
              learners.
            </p>
            <div className="">
              <img
                className="mx-auto md:absolute md:bottom-8 md:right-8 object-cover"
                src={Astronaut}
                width="240"
                height="240"
                alt="Hero"
              />
            </div>
          </div>

          {/* Hero image */}
          <div>
            {/* <div
              className="relative flex justify-center items-center "
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img
                className="mx-auto"
                src={Banner}
                width="1024"
                height="504"
                alt="Hero"
              />
              <span className="absolute group" href="#0" aria-controls="modal">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 hover:opacity-75 transition duration-150 ease-in-out"
                  viewBox="0 0 88 88"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      x1="78.169%"
                      y1="9.507%"
                      x2="24.434%"
                      y2="90.469%"
                      id="a"
                    >
                      <stop stopColor="#1BF1F5" stopOpacity=".8" offset="0%" />
                      <stop stopColor="#EBF1F5" offset="100%" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </div> */}

            {/* Modal */}
            <Modal
              id="modal"
              ariaLabel="modal-headline"
              show={videoModalOpen}
              handleClose={() => setVideoModalOpen(false)}
            >
              <div className="relative pb-9/16">
                <iframe
                  className="absolute w-full h-full"
                  src="https://player.vimeo.com/video/174002812"
                  title="Video"
                  allowFullScreen
                ></iframe>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroHome;
