import { Footer, Header } from ".";

const MainLayout = ({
	children,
	headerOptions,
	footerOptions,
	mainOptions: { paddingVertical = true, centerHorizontal = false } = {},
}) => {
	return (
		<div className="flex min-h-screen w-full flex-col bg-theme-bg text-theme-text">
			<Header {...headerOptions} />
			<main
				className={`flex flex-grow ${paddingVertical ? "py-20" : ""} ${
					centerHorizontal ? "justify-center" : ""
				}`}
			>
				{children}
			</main>
			<Footer {...footerOptions} />
		</div>
	);
};

export default MainLayout;
