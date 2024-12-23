// utils.js
function getSriLankanTime() {
  const now = new Date();
  
  // Add 5.5 hours (5 hours and 30 minutes) to the current time
  const sriLankanTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  
  return sriLankanTime.toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
}

module.exports = {
  getSriLankanTime,
};
