function MainContent(props) {
	return (
		<div className="md:col-span-7">
			<div className="relative overflow-hidden rounded-lg">
				<div className="mb-4">
					<h2 className="text-2xl font-bold text-black">
						{props.name}
					</h2>
				</div>
				<img
					src={props.thumbnail}
					alt={props.name}
					className="h-[400px] w-full object-cover"
				/>
			</div>
		</div>
	);
}

export default MainContent;
