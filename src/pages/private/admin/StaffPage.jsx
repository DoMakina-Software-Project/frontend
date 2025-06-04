import { MainLayout } from "../../../components/layouts";
import StaffTable from "../../../components/pages/Admin/StaffTable";
import { useNavigate } from "react-router-dom";
import { deleteStaff, getAllStaff } from "../../../api/admin";
import { useApi } from "../../../hooks";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui";

const StaffPage = () => {
	const navigate = useNavigate();
	const { handleApiCall: getStaffApiCall } = useApi(getAllStaff);
	const { handleApiCall: deleteStaffApiCall } = useApi(deleteStaff);

	const [staff, setStaff] = useState([]);

	const handleEdit = (id) => {
		navigate(`/admin/staff/edit/${id}`);
	};

	const handleDelete = (id) => {
		deleteStaffApiCall({ id }).then((data) => {
			if (data) {
				setStaff((prev) => prev.filter((member) => member.id !== id));
			}
		});
	};

	useEffect(() => {
		getStaffApiCall().then((data) => {
			if (data) {
				setStaff(data);
			}
		});
	}, []);

	return (
		<MainLayout mainOptions={{ paddingVertical: false }}>
			<div className="container mx-auto min-h-[70vh] px-4 py-8">
				<div className="mb-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold">Staff Members</h1>
					<Button
						extendClassName
						className="h-9"
						onClick={() => navigate("/admin/staff/create")}
					>
						Create Staff
					</Button>
				</div>
				<StaffTable
					staff={staff}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			</div>
		</MainLayout>
	);
};

export default StaffPage;
