import { ClipLoader } from "react-spinners";

const LoadingIndicator = ({ size = 60, color = "#4476fb" }) => {
	return <ClipLoader color={color} size={size} />;
};

export default LoadingIndicator;
