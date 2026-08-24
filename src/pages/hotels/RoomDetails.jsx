import { Navigate, useLocation } from 'react-router-dom';

const RoomDetails = () => {
  const { pathname } = useLocation();
  const hotelPath = pathname.split('/').slice(0, -1).join('/') || '/services';
  return <Navigate to={hotelPath} replace />;
};

export default RoomDetails;
