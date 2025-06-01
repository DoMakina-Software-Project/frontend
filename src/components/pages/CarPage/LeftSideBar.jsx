import { useState } from "react";

function LeftSidebar({ thumbnails, setCurrentSlide }) {
	const [index1, setIndex] = useState(0);
	const isMoreThanFive = thumbnails.length > 5;
	let picsToDisplay = return5Pics(thumbnails, index1);
	return (
		<div className="hidden md:col-span-2 md:block">
			<div className="space-y-2">
				{picsToDisplay.map((thumb, index) => (
					<div
						key={index}
						className="relative cursor-pointer overflow-hidden rounded-lg"
						onMouseEnter={() => {
							// Calculate the correct index to prevent overflow
							const newIndex =
								(index1 + index) % thumbnails.length;
							setCurrentSlide(newIndex);
						}}
					>
						<img
							src={thumb}
							alt={`View ${index + 1}`}
							className="h-20 w-full object-cover"
						/>
						{/* Button to change the image to the previous image */}
						{isMoreThanFive && index === 0 && (
							<button
								className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/50 p-2 text-white"
								onClick={() => {
									// Decrease the index and wrap it around to the last image if necessary
									const newIndex =
										(index1 - 1 + thumbnails.length) %
										thumbnails.length;
									setIndex(newIndex);
									picsToDisplay = return5Pics(
										thumbnails,
										newIndex,
									);
								}}
							>
								<svg
									className="h-6 w-12"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 12"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 9l-7-7-7 7"
									/>
								</svg>
							</button>
						)}
						{/* Button to change the image to the next image */}
						{isMoreThanFive && index === 4 && (
							<button
								className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-black/50 p-2 text-white"
								onClick={() => {
									setIndex((index1 + 1) % thumbnails.length);
									picsToDisplay = return5Pics(
										thumbnails,
										index1,
									);
								}}
							>
								<svg
									className="h-6 w-12"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 12"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 5l-7 7-7-7" // This creates a down arrow
									/>
								</svg>
							</button>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default LeftSidebar;

function return5Pics(pics, index) {
	// Limit the number of images to the length of the array (no duplicates)
	let newArray = [];
	const numPics = Math.min(pics.length, 5); // Ensure it doesn’t exceed 5, and doesn't repeat if there are fewer than 5

	for (let i = 0; i < numPics; i++) {
		let temp = (index + i) % pics.length;
		newArray.push(pics[temp]);
	}

	return newArray;
}
