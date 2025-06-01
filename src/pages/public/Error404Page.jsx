import { Link } from "react-router-dom";
import { MainLayout } from "../../components/layouts";

const Error404Page = () => {
	return (
		<MainLayout>
			<div className="flex min-h-[35vh] flex-grow flex-col items-center justify-center space-y-6 p-4">
				<div className="w-full max-w-md">
					<img
						src="https://cdn.forge.tylertech.com/v1/images/spot-hero/404-error-spot-hero.svg"
						alt="404 Error"
						className="h-auto w-full"
					/>
				</div>
				<h1 className="text-2xl">Ku je tu shku mor</h1>
				<Link className="text-theme-blue hover:underline" to="/">
					Olimpi asht anej
				</Link>
			</div>
		</MainLayout>
	);
};

export default Error404Page;
