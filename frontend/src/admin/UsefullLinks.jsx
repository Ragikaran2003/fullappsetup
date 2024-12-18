import { useState } from 'react';
import DPLOGO from '../assets/Dplogo.png'
import DailyReport from '../assets/DailyReport.jpg'


// Array of useful websites with their image URLs and names
const links = [
  {
    name: "Dp Monitoring System",
    image: DPLOGO,
    url: "https://dpedumonitoring.site/login",
  },
  {
    name: "Daily Report",
    image: DailyReport,
    url: "https://docs.google.com/spreadsheets/d/1CJM46N85il5AT-c4EeJEquiPVomrtcKIm8jBSGvAZC0/edit?gid=652601670#gid=652601670",
  },
  
];

export const UsefullLinks = () => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, text: "" });

  // Handle when mouse enters on an image link
  const handleMouseEnter = (e, name) => {
    const rect = e.target.getBoundingClientRect();
    setTooltip({
      show: true,
      x: rect.right + 5, // Position near the hovered image
      y: rect.top + rect.height / 2,
      text: name,
    });
  };

  // Handle mouse leave to hide the tooltip
  const handleMouseLeave = () => {
    setTooltip({ show: false });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Useful Website Links</h1>
      </header>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {links.map((link, index) => (
          <div
            key={index}
            className="relative group cursor-pointer bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
            onMouseEnter={(e) => handleMouseEnter(e, link.name)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Website Image */}
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-16 w-16 object-cover transition-all duration-300"
            >
              <img
                src={link.image}
                alt={link.name}
                className="h-full w-full"
              />
            </a>
          </div>
        ))}
      </div>

      {/* Tooltip Bubble */}
      {tooltip.show && (
        <div
          className="absolute bg-white text-black text-sm p-2 rounded-md shadow-lg"
          style={{
            top: tooltip.y + window.scrollY + 'px',
            left: tooltip.x + window.scrollX + 'px',
            transform: 'translate(-50%, -50%)',
            zIndex: 1000,
            whiteSpace: 'nowrap',
          }}
        >
          {tooltip.text}
        </div>
      )}
    </div>
  );
};
