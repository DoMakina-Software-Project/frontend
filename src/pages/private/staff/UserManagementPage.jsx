import { useState, useEffect } from "react";
import {
	getAllUsers,
	getUsersByRole,
	updateUserStatus,
	updateUser,
	getUserStatistics,
} from "../../../api/staff";
import { useApi, useAuth, useConfirmation } from "../../../hooks";
import { MainLayout } from "../../../components/layouts";

const UserManagementPage = () => {
	const { currentUser } = useAuth();
	const { showConfirmation } = useConfirmation();
	const isAdmin = currentUser?.roles?.includes("SUPERADMIN");

	const [users, setUsers] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalItems, setTotalItems] = useState(0);
	const [hasNextPage, setHasNextPage] = useState(false);
	const [selectedRole, setSelectedRole] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [statistics, setStatistics] = useState(null);
	const [loading, setLoading] = useState(true);
	const [editingUser, setEditingUser] = useState(null);
	const [editForm, setEditForm] = useState({
		name: "",
		surname: "",
	});

	const { handleApiCall: handleGetUsers } = useApi(getAllUsers);
	const { handleApiCall: handleGetUsersByRole } = useApi(getUsersByRole);
	const { handleApiCall: handleUpdateUserStatus } = useApi(updateUserStatus);
	const { handleApiCall: handleUpdateUser } = useApi(updateUser);
	const { handleApiCall: handleGetStatistics } = useApi(getUserStatistics);

	const fetchUsers = async (page = 1, role = "") => {
		setLoading(true);
		try {
			let response;
			if (role) {
				response = await handleGetUsersByRole({ role, page });
			} else {
				response = await handleGetUsers({ page, role: role || null });
			}

			if (response) {
				setUsers(response.results);
				setTotalPages(response.totalPages);
				setTotalItems(response.totalItems);
				setHasNextPage(response.hasNextPage);
			}
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	const fetchStatistics = async () => {
		try {
			const response = await handleGetStatistics();
			if (response) {
				setStatistics(response);
			}
		} catch (error) {
			console.error("Error fetching statistics:", error);
		}
	};

	useEffect(() => {
		fetchUsers(1, selectedRole);
		fetchStatistics();
	}, [selectedRole]);

	const handleRoleFilter = (role) => {
		setSelectedRole(role);
		setCurrentPage(1);
	};

	const handlePageChange = (page) => {
		setCurrentPage(page);
		fetchUsers(page, selectedRole);
	};

	const handleStatusChange = async (userId, newStatus, userName) => {
		showConfirmation({
			title: "Change User Status",
			message: `Are you sure you want to change ${userName}'s status to ${newStatus}?`,
			confirmText: "Yes, Change Status",
			cancelText: "Cancel",
			onConfirm: async () => {
				try {
					await handleUpdateUserStatus({
						id: userId,
						status: newStatus,
					});
					fetchUsers(currentPage, selectedRole);
					fetchStatistics(); // Refetch statistics after status change
				} catch (error) {
					console.error("Error updating user status:", error);
				}
			},
		});
	};

	const handleEditUser = (user) => {
		setEditingUser(user);
		setEditForm({
			name: user.name,
			surname: user.surname,
		});
	};

	const handleSaveEdit = async () => {
		try {
			await handleUpdateUser({ id: editingUser.id, userData: editForm });
			setEditingUser(null);
			fetchUsers(currentPage, selectedRole);
		} catch (error) {
			console.error("Error updating user:", error);
		}
	};

	const filteredUsers = users.filter((user) =>
		searchTerm
			? user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.surname
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				user.email?.toLowerCase().includes(searchTerm.toLowerCase())
			: true,
	);

	const getStatusBadgeColor = (status) => {
		switch (status) {
			case "ACTIVE":
				return "bg-green-100 text-green-800";
			case "INACTIVE":
				return "bg-yellow-100 text-yellow-800";
			case "BANNED":
				return "bg-red-100 text-red-800";
			case "DELETED":
				return "bg-gray-100 text-gray-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getRoleBadgeColor = (roles) => {
		if (roles.includes("SUPERADMIN"))
			return "bg-purple-100 text-purple-800";
		if (roles.includes("STAFF")) return "bg-blue-100 text-blue-800";
		if (roles.includes("SELLER")) return "bg-orange-100 text-orange-800";
		if (roles.includes("CLIENT")) return "bg-green-100 text-green-800";
		return "bg-gray-100 text-gray-800";
	};

	const canModifyUser = (user) => {
		// Staff cannot modify admin users, but admin can modify anyone
		if (isAdmin) return true;
		return (
			!user.roles.includes("STAFF") && !user.roles.includes("SUPERADMIN")
		);
	};

	const canEditUser = (user) => {
		// Only admin can edit user details
		return isAdmin && canModifyUser(user);
	};

	return (
		<MainLayout mainOptions={{ paddingVertical: true }}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900">
						User Management
					</h1>
					<p className="text-gray-600">
						{isAdmin
							? "Manage all users and their permissions"
							: "Manage users and their permissions"}
					</p>
				</div>

				{/* Statistics */}
				{statistics && (
					<div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-5">
						<div className="rounded-lg bg-white p-4 shadow">
							<h3 className="text-sm font-medium text-gray-500">
								Total Users
							</h3>
							<p className="text-2xl font-bold text-gray-900">
								{statistics.total}
							</p>
						</div>
						<div className="rounded-lg bg-white p-4 shadow">
							<h3 className="text-sm font-medium text-gray-500">
								Active
							</h3>
							<p className="text-2xl font-bold text-green-600">
								{statistics.active}
							</p>
						</div>
						<div className="rounded-lg bg-white p-4 shadow">
							<h3 className="text-sm font-medium text-gray-500">
								Inactive
							</h3>
							<p className="text-2xl font-bold text-yellow-600">
								{statistics.inactive}
							</p>
						</div>
						<div className="rounded-lg bg-white p-4 shadow">
							<h3 className="text-sm font-medium text-gray-500">
								Banned
							</h3>
							<p className="text-2xl font-bold text-red-600">
								{statistics.banned}
							</p>
						</div>
						<div className="rounded-lg bg-white p-4 shadow">
							<h3 className="text-sm font-medium text-gray-500">
								Deleted
							</h3>
							<p className="text-2xl font-bold text-gray-600">
								{statistics.deleted}
							</p>
						</div>
					</div>
				)}

				{/* Filters */}
				<div className="mb-6 rounded-lg bg-white p-4 shadow">
					<div className="flex flex-col gap-4 md:flex-row">
						<div className="flex-1">
							<input
								type="text"
								placeholder="Search users..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => handleRoleFilter("")}
								className={`rounded-md px-4 py-2 ${
									selectedRole === ""
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								All
							</button>
							<button
								onClick={() => handleRoleFilter("CLIENT")}
								className={`rounded-md px-4 py-2 ${
									selectedRole === "CLIENT"
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								Clients
							</button>
							<button
								onClick={() => handleRoleFilter("SELLER")}
								className={`rounded-md px-4 py-2 ${
									selectedRole === "SELLER"
										? "bg-blue-500 text-white"
										: "bg-gray-200 text-gray-700 hover:bg-gray-300"
								}`}
							>
								Sellers
							</button>
							{/* Show staff filter only for admin users */}
							{isAdmin && (
								<button
									onClick={() => handleRoleFilter("STAFF")}
									className={`rounded-md px-4 py-2 ${
										selectedRole === "STAFF"
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-gray-700 hover:bg-gray-300"
									}`}
								>
									Staff
								</button>
							)}
						</div>
					</div>
				</div>

				{/* Edit User Modal */}
				{editingUser && (
					<div className="fixed inset-0 z-50 h-full w-full overflow-y-auto bg-gray-600 bg-opacity-50">
						<div className="relative top-20 mx-auto w-96 rounded-md border bg-white p-5 shadow-lg">
							<div className="mt-3">
								<h3 className="mb-4 text-lg font-medium text-gray-900">
									Edit User
								</h3>
								<div className="space-y-4">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Name
										</label>
										<input
											type="text"
											value={editForm.name}
											onChange={(e) =>
												setEditForm({
													...editForm,
													name: e.target.value,
												})
											}
											className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Surname
										</label>
										<input
											type="text"
											value={editForm.surname}
											onChange={(e) =>
												setEditForm({
													...editForm,
													surname: e.target.value,
												})
											}
											className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>
								</div>
								<div className="mt-6 flex gap-2">
									<button
										onClick={handleSaveEdit}
										className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
									>
										Save
									</button>
									<button
										onClick={() => setEditingUser(null)}
										className="rounded-md bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Users Table */}
				<div className="overflow-hidden rounded-lg bg-white shadow">
					{loading ? (
						<div className="flex h-96 items-center justify-center">
							<div className="text-center">
								<div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
								<p className="mt-4 text-gray-600">
									Loading users...
								</p>
							</div>
						</div>
					) : (
						<>
							<div className="min-h-96 overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
												User
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
												Email
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
												Role
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
												Status
											</th>
											<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-200 bg-white">
										{filteredUsers.length > 0 ? (
											filteredUsers.map((user) => (
												<tr key={user.id}>
													<td className="whitespace-nowrap px-6 py-4">
														<div>
															<div className="text-sm font-medium text-gray-900">
																{user.name}{" "}
																{user.surname}
															</div>
															<div className="text-sm text-gray-500">
																ID: {user.id}
															</div>
														</div>
													</td>
													<td className="whitespace-nowrap px-6 py-4">
														<div className="text-sm text-gray-900">
															{user.email}
														</div>
													</td>
													<td className="whitespace-nowrap px-6 py-4">
														<span
															className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getRoleBadgeColor(
																user.roles,
															)}`}
														>
															{user.roles.join(
																", ",
															)}
														</span>
													</td>
													<td className="whitespace-nowrap px-6 py-4">
														<span
															className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadgeColor(
																user.status,
															)}`}
														>
															{user.status}
														</span>
													</td>
													<td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
														{canModifyUser(user) ? (
															<div className="flex space-x-2">
																{canEditUser(
																	user,
																) && (
																	<button
																		onClick={() =>
																			handleEditUser(
																				user,
																			)
																		}
																		className="text-blue-600 hover:text-blue-900"
																	>
																		Edit
																	</button>
																)}

																<select
																	onChange={(
																		e,
																	) =>
																		handleStatusChange(
																			user.id,
																			e
																				.target
																				.value,
																			`${user.name} ${user.surname}`,
																		)
																	}
																	className="rounded border border-gray-300 px-2 py-1 text-sm"
																	defaultValue=""
																>
																	<option
																		value=""
																		disabled
																	>
																		Change
																		Status
																	</option>
																	<option value="ACTIVE">
																		Active
																	</option>
																	<option value="INACTIVE">
																		Inactive
																	</option>
																	<option value="BANNED">
																		Banned
																	</option>
																	{isAdmin && (
																		<option value="DELETED">
																			Deleted
																		</option>
																	)}
																</select>
															</div>
														) : (
															<span className="text-gray-400">
																{isAdmin
																	? "Self"
																	: "Protected"}
															</span>
														)}
													</td>
												</tr>
											))
										) : (
											<tr>
												<td
													colSpan="5"
													className="px-6 py-12 text-center"
												>
													<div className="text-gray-500">
														<svg
															className="mx-auto h-12 w-12 text-gray-400"
															fill="none"
															viewBox="0 0 24 24"
															stroke="currentColor"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-1 1m1-1l1 1M7 7l1-1M7 7l-1 1"
															/>
														</svg>
														<p className="mt-2 text-sm font-medium text-gray-900">
															No users found
														</p>
														<p className="mt-1 text-sm text-gray-500">
															{searchTerm
																? "Try adjusting your search or filter criteria"
																: selectedRole
																	? `No users found with ${selectedRole} role`
																	: "No users available"}
														</p>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3">
									<div className="flex flex-1 justify-between sm:hidden">
										<button
											onClick={() =>
												handlePageChange(
													currentPage - 1,
												)
											}
											disabled={currentPage === 1}
											className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
										>
											Previous
										</button>
										<button
											onClick={() =>
												handlePageChange(
													currentPage + 1,
												)
											}
											disabled={!hasNextPage}
											className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
										>
											Next
										</button>
									</div>
									<div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
										<div>
											<p className="text-sm text-gray-700">
												Showing{" "}
												<span className="font-medium">
													{(currentPage - 1) * 10 + 1}
												</span>{" "}
												to{" "}
												<span className="font-medium">
													{Math.min(
														currentPage * 10,
														totalItems,
													)}
												</span>{" "}
												of{" "}
												<span className="font-medium">
													{totalItems}
												</span>{" "}
												results
											</p>
										</div>
										<div>
											<nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
												<button
													onClick={() =>
														handlePageChange(
															currentPage - 1,
														)
													}
													disabled={currentPage === 1}
													className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
												>
													Previous
												</button>
												{Array.from(
													{ length: totalPages },
													(_, i) => i + 1,
												).map((page) => (
													<button
														key={page}
														onClick={() =>
															handlePageChange(
																page,
															)
														}
														className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
															page === currentPage
																? "z-10 border-blue-500 bg-blue-50 text-blue-600"
																: "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
														}`}
													>
														{page}
													</button>
												))}
												<button
													onClick={() =>
														handlePageChange(
															currentPage + 1,
														)
													}
													disabled={!hasNextPage}
													className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
												>
													Next
												</button>
											</nav>
										</div>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</MainLayout>
	);
};

export default UserManagementPage;
