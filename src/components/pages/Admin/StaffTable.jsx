const StaffTable = ({ staff, onEdit, onDelete }) => {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full bg-white">
				<thead className="bg-gray-100">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							ID
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Name
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Surname
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Email
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
					{staff.map((member) => (
						<tr key={member.id}>
							<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{member.id}
							</td>
							<td className="whitespace-nowrap px-6 py-4">
								<div className="text-sm font-medium text-gray-900">
									{member.name}
								</div>
							</td>
							<td className="whitespace-nowrap px-6 py-4">
								<div className="text-sm font-medium text-gray-900">
									{member.surname}
								</div>
							</td>
							<td className="whitespace-nowrap px-6 py-4">
								<div className="text-sm text-gray-500">
									{member.email}
								</div>
							</td>
							<td className="whitespace-nowrap px-6 py-4">
								<span
									className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
										member.status === "ACTIVE"
											? "bg-green-100 text-green-800"
											: member.status === "INACTIVE"
												? "bg-yellow-100 text-yellow-800"
												: member.status === "BANNED"
													? "bg-red-100 text-red-800"
													: "bg-gray-100 text-gray-800"
									}`}
								>
									{member.status}
								</span>
							</td>
							<td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
								<button
									onClick={() => onEdit(member.id)}
									className="mr-4 text-blue-500 hover:text-blue-300"
								>
									Edit
								</button>
								<button
									onClick={() => onDelete(member.id)}
									className="text-red-600 hover:text-red-900"
								>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default StaffTable;
