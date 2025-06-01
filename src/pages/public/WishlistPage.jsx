import { MainLayout } from "../../components/layouts";
import { WishlistGrid } from "../../components/pages/Wishlist";

const WishlistPage = () => {
	return (
		<MainLayout>
			<div className="flex flex-grow flex-col items-center justify-center gap-16">
				<h1 className="mb-6 text-center text-2xl font-bold">
					Wishlist Page
				</h1>

				<WishlistGrid />
			</div>
		</MainLayout>
	);
};

export default WishlistPage;
