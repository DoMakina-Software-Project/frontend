import { useEffect, useState } from "react";
import LeftSideBar from "../../components/pages/CarPage/LeftSideBar";
import MainContent from "../../components/pages/CarPage/MainContent";
import RightPanel from "../../components/pages/CarPage/RightPanel";
import { MainLayout } from "../../components/layouts";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getCar } from "../../api/public";
import { useApi } from "../../hooks";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { getCarReviews, getCarRating } from "../../api/public";
import { Button } from "../../components/ui";

const StarRating = ({ rating }) => {
	const fullStars = Math.floor(rating);
	const hasHalfStar = rating % 1 >= 0.5;

	return (
		<div className="flex items-center">
			{[...Array(fullStars)].map((_, i) => (
				<FaStar key={i} className="text-yellow-400" />
			))}
			{hasHalfStar && <FaStarHalf className="text-yellow-400" />}
			{[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
				<FaStar key={i + fullStars} className="text-gray-300" />
			))}
			<span className="ml-2 text-sm text-gray-600">{rating}</span>
		</div>
	);
};

export default function CarPage() {
	const { handleApiCall: getCarApiCall } = useApi(getCar);
	const { handleApiCall: getCarReviewsApiCall } = useApi(getCarReviews);
	const { handleApiCall: getCarRatingApiCall } = useApi(getCarRating);
	const [currentSlide, setCurrentSlide] = useState(0);
	const [reviews, setReviews] = useState([]);
	const [rating, setRating] = useState({ averageRating: 0, totalReviews: 0 });
	const [currentPage, setCurrentPage] = useState(1);
	const [hasNextPage, setHasNextPage] = useState(false);

	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const [car, setCar] = useState(null);
	const [initialDates, setInitialDates] = useState({
		startDate: "",
		endDate: "",
	});

	useEffect(() => {
		getCarApiCall(id).then((data) => {
			if (data) {
				setCar(data);
			}
		});

		// Get car rating
		getCarRatingApiCall(id).then((data) => {
			if (data) {
				setRating(data);
			}
		});

		// Get initial reviews
		fetchReviews(1);
	}, [id]);

	const fetchReviews = async (page) => {
		const data = await getCarReviewsApiCall(id, { page });
		if (data) {
			if (page === 1) {
				setReviews(data.reviews);
			} else {
				setReviews((prev) => [...prev, ...data.reviews]);
			}
			setCurrentPage(data.currentPage);
			setHasNextPage(data.hasNextPage);
		}
	};

	// Function to validate date format (YYYY-MM-DD)
	const isValidDate = (dateString) => {
		if (!dateString) return false;
		const regex = /^\d{4}-\d{2}-\d{2}$/;
		if (!regex.test(dateString)) return false;

		const date = new Date(dateString);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		// Check if date is valid and not in the past
		return date instanceof Date && !isNaN(date) && date >= today;
	};

	// Extract and validate dates from URL parameters
	useEffect(() => {
		const startDate = searchParams.get("startDate");
		const endDate = searchParams.get("endDate");

		if (
			startDate &&
			endDate &&
			isValidDate(startDate) &&
			isValidDate(endDate)
		) {
			const start = new Date(startDate);
			const end = new Date(endDate);

			// Ensure end date is after start date
			if (end > start) {
				setInitialDates({ startDate, endDate });
			}
		}
	}, [searchParams]);

	const handleLoadMore = () => {
		if (hasNextPage) {
			fetchReviews(currentPage + 1);
		}
	};

	return (
		<MainLayout>
			{car ? (
				<div className="mx-auto max-w-7xl bg-white p-4">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-12">
						<LeftSideBar
							thumbnails={car.images}
							currentSlide={currentSlide}
							setCurrentSlide={setCurrentSlide}
						/>
						<MainContent
							name={`${car.brand} ${car.model}`}
							thumbnail={car.images[currentSlide]}
						/>
						<RightPanel
							carDetails={car}
							initialDates={initialDates}
						/>
					</div>

					{/* Reviews Section */}
					<div className="mt-8">
						<div className="mb-4 flex items-center justify-between">
							<h2 className="text-2xl font-bold">Reviews</h2>
							<div className="flex items-center gap-4">
								<StarRating rating={rating.averageRating} />
								<span className="text-sm text-gray-600">
									({rating.totalReviews} reviews)
								</span>
							</div>
						</div>

						{reviews.length > 0 ? (
							<div className="space-y-4">
								{reviews.map((review) => (
									<div
										key={review.id}
										className="rounded-lg border border-gray-200 p-4"
									>
										<div className="mb-2 flex items-center justify-between">
											<div className="flex items-center gap-2">
												<span className="font-medium">
													{review.User.name}
												</span>
												<span className="text-sm text-gray-500">
													{new Date(
														review.createdAt,
													).toLocaleDateString()}
												</span>
											</div>
											<StarRating
												rating={review.rating}
											/>
										</div>
										<p className="text-gray-700">
											{review.comment}
										</p>
									</div>
								))}

								{hasNextPage && (
									<div className="mt-4 flex justify-center">
										<Button
											variant="outline"
											onClick={handleLoadMore}
										>
											Load More Reviews
										</Button>
									</div>
								)}
							</div>
						) : (
							<p className="text-center text-gray-500">
								No reviews yet
							</p>
						)}
					</div>
				</div>
			) : (
				<div className="flex min-h-[35vh] flex-grow flex-col items-center justify-center space-y-1">
					<h1 className="text-2xl">Car Not Found</h1>
					<Link className="text-theme-blue" to="/">
						Go to Home
					</Link>
				</div>
			)}
		</MainLayout>
	);
}
