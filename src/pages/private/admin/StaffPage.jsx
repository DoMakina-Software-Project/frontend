import { MainLayout } from "../../../components/layouts";
import StaffTable from "../../../components/pages/Admin/StaffTable";
import { useNavigate } from "react-router-dom";
import { getAllStaff, deleteStaff } from "../../../api/admin";
import { useApi, useConfirmation } from "../../../hooks";
import { useEffect, useState } from "react";
import { Button } from "../../../components/ui";

const StaffPage = () => {
	const navigate = useNavigate();
	const { showConfirmation } = useConfirmation();
	const { handleApiCall: getStaffApiCall, loading: loadingStaff } =
		useApi(getAllStaff);
	const { handleApiCall: deleteStaffApiCall } = useApi(deleteStaff);

	const [staff, setStaff] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);

	const handleEdit = (id) => {
		navigate(`/admin/staff/edit/${id}`);
	};

	const handleDelete = (id, staffName) => {
		showConfirmation({
			title: "Delete Staff Member",
			message: `Are you sure you want to delete ${staffName}? This action cannot be undone and will revoke their access to the system.`,
			confirmText: "Yes, Delete Staff",
			cancelText: "Cancel",
			onConfirm: async () => {
				try {
					const data = await deleteStaffApiCall({ id });
					if (data) {
						setStaff((prev) =>
							prev.filter((member) => member.id !== id),
						);
						setTotalItems((prev) => prev - 1);
					}
				} catch (error) {
					console.error("Error deleting staff member:", error);
				}
			},
		});
	};

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const fetchStaff = async (page = 1) => {
		const data = await getStaffApiCall({ page });
		if (data) {
			setStaff(data.results || []);
			setTotalPages(data.totalPages || 1);
			setTotalItems(data.totalItems || 0);
		}
	};

	useEffect(() => {
		fetchStaff(currentPage);
	}, [currentPage]);

	// Pagination Component
	const PaginationComponent = () => {
		if (totalPages <= 1) return null;

		const pageNumbers = [];
		const maxVisiblePages = 5;
		let startPage = Math.max(
			1,
			currentPage - Math.floor(maxVisiblePages / 2),
		);
		let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

		// Adjust startPage if we're near the end
		if (endPage - startPage + 1 < maxVisiblePages) {
			startPage = Math.max(1, endPage - maxVisiblePages + 1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}

		return (
			<div className="mt-8 flex items-center justify-center space-x-2">
				<button
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
						currentPage === 1
							? "cursor-not-allowed bg-gray-100 text-gray-400"
							: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
					}`}
				>
					Previous
				</button>

				{startPage > 1 && (
					<>
						<button
							onClick={() => handlePageChange(1)}
							className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							1
						</button>
						{startPage > 2 && (
							<span className="px-2 py-2 text-gray-500">...</span>
						)}
					</>
				)}

				{pageNumbers.map((number) => (
					<button
						key={number}
						onClick={() => handlePageChange(number)}
						className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
							currentPage === number
								? "bg-theme-blue text-white"
								: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
						}`}
					>
						{number}
					</button>
				))}

				{endPage < totalPages && (
					<>
						{endPage < totalPages - 1 && (
							<span className="px-2 py-2 text-gray-500">...</span>
						)}
						<button
							onClick={() => handlePageChange(totalPages)}
							className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							{totalPages}
						</button>
					</>
				)}

				<button
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
						currentPage === totalPages
							? "cursor-not-allowed bg-gray-100 text-gray-400"
							: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
					}`}
				>
					Next
				</button>
			</div>
		);
	};

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

				{/* Pagination Info */}
				{!loadingStaff && staff.length > 0 && (
					<div className="mb-4 flex items-center justify-between text-sm text-gray-600">
						<span>
							Showing {(currentPage - 1) * 10 + 1}-
							{Math.min(currentPage * 10, totalItems)} of{" "}
							{totalItems} staff members
						</span>
						{totalPages > 1 && (
							<span>
								Page {currentPage} of {totalPages}
							</span>
						)}
					</div>
				)}

				{/* Loading State */}
				{loadingStaff ? (
					<div className="flex items-center justify-center py-12">
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-theme-blue border-t-transparent"></div>
					</div>
				) : staff.length === 0 ? (
					<div className="rounded-lg bg-white p-12 text-center shadow-sm">
						<h3 className="mb-2 text-xl font-semibold text-gray-900">
							No staff members found
						</h3>
						<p className="mb-6 text-gray-600">
							You haven&apos;t created any staff members yet.
						</p>
						<Button onClick={() => navigate("/admin/staff/create")}>
							Create First Staff Member
						</Button>
					</div>
				) : (
					<>
						<StaffTable
							staff={staff}
							onEdit={handleEdit}
							onDelete={handleDelete}
						/>

						{/* Pagination */}
						<PaginationComponent />
					</>
				)}
			</div>
		</MainLayout>
	);
};

export default StaffPage;
