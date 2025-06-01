import { MainLayout } from "../../../components/layouts";
import BrandTable from "../../../components/pages/Admin/BrandTable";
import { useNavigate } from "react-router-dom";
import { deleteBrand } from "../../../api/staff";
import { getAllBrands } from "../../../api/public";
import { useApi } from "../../../hooks";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui";

const StaffBrandsPage = () => {
	const navigate = useNavigate();
	const { handleApiCall: getBrandsApiCall } = useApi(getAllBrands);
	const { handleApiCall: deleteBrandApiCall } = useApi(deleteBrand);

	const [brands, setBrands] = useState([]);

	const handleEdit = (id) => {
		navigate(`/admin/brands/edit/${id}`);
	};

	const handleDelete = (id) => {
		deleteBrandApiCall({ id }).then((data) => {
			if (data) {
				setBrands((prev) => prev.filter((brand) => brand.id !== id));
			}
		});
	};

	useEffect(() => {
		getBrandsApiCall().then((data) => {
			if (data) {
				setBrands(data);
			}
		});
	}, []);

	return (
		<MainLayout mainOptions={{ paddingVertical: false }}>
			<div className="container mx-auto min-h-[70vh] px-4 py-8">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold">Car Brands</h1>
					<Button
						extendClassName
						className="h-9"
						onClick={() => navigate("/admin/brands/create")}
					>
						Create
					</Button>
				</div>
				<BrandTable
					brands={brands}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			</div>
		</MainLayout>
	);
};

export default StaffBrandsPage;
