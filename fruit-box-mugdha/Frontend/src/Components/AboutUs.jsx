import React from "react";
import HomeNavbar from "../home/HomeNavbar";

function AboutUs() {
  return (
    <>
      <HomeNavbar />
      <div className="bg-[#1D232A] py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-white mb-6">
            About Us
          </h1>
          <p className="text-lg text-gray-300 text-center mb-12">
            Welcome to Fruitbox, your local fresh fruit delivery service. Our
            mission is to bring the freshest fruits directly from local vendors
            to your doorstep. We believe in supporting our local farmers and
            ensuring that our customers enjoy healthy, delicious, and
            sustainably sourced fruits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Our Mission */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-300">
                At Fruitbox, our mission is to connect local fruit vendors with
                the community and provide an easy and efficient way to access
                fresh, seasonal fruits. We aim to reduce food waste, support
                local businesses, and promote healthy living.
              </p>
            </div>
            {/* Why Choose Us */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Why Choose Us?
              </h2>
              <ul className="list-disc pl-5 text-gray-300">
                <li>Locally sourced fruits from trusted vendors</li>
                <li>Fresh and seasonal produce</li>
                <li>Convenient delivery to your doorstep</li>
                <li>Support local businesses and reduce carbon footprint</li>
              </ul>
            </div>
          </div>
          {/* Our Team */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
              {/* Team Member 1 */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center h-72 w-[311px] flex flex-col items-center gap-5">
                <img
                  src="/manas.jpg"
                  alt="Team Member 1"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-white">
                  Manas Maheshwari
                </h3>
                <p className="text-gray-300">Developer</p>
              </div>
              {/* Team Member 2 */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center h-72 w-[311px] flex flex-col items-center gap-5">
                <img
                  src="/nandini.jpg"
                  alt="Team Member 2"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-white">
                  Nandini Patel
                </h3>
                <p className="text-gray-300">Developer</p>
              </div>
              {/* Team Member 3 */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center h-72 w-[311px] flex flex-col items-center gap-5">
                <img
                  src="/mugdha.jpg"
                  alt="Team Member 3"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-white">
                  Mugdha Deoskar
                </h3>
                <p className="text-gray-300">Developer</p>
              </div>
              {/* Team Member 4 and 5 in a centered row */}
              <div className="col-span-full flex justify-center gap-10">
                {/* Team Member 4 */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center h-72 w-[311px] flex flex-col items-center gap-5">
                  <img
                    src="/lokesh.jpg"
                    alt="Team Member 4"
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-white">
                    Lokesh Waghe
                  </h3>
                  <p className="text-gray-300">Developer</p>
                </div>
                {/* Team Member 5 */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center h-72 w-[311px] flex flex-col items-center gap-5">
                  <img
                    src="/neha.jpg"
                    alt="Team Member 5"
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-xl font-semibold text-white">
                    Neha Patel
                  </h3>
                  <p className="text-gray-300">Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
