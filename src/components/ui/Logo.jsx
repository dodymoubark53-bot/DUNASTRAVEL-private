const Logo = ({ height = 60 }) => {
  // Dunas Travel logo is ~ 709x352 (approx 2:1 aspect ratio)
  const width = Math.round(height * 2);

  return (
    <img
      src={`https://res.cloudinary.com/degbrq3ck/image/upload/w_${width},h_${height},c_limit,q_auto,f_webp/v1783033035/dunas-travel-logo-removebg-preview_mjfl90.webp`}
      alt="Dunas Travel"
      className="flex-shrink-0 object-contain"
      width={width}
      height={height}
      fetchPriority="high"
      style={{ height: `${height}px`, width: `${width}px` }}
    />
  );
};

export default Logo;
