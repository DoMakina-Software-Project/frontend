const BrandTable = ({ brands, onEdit, onDelete }) => {
	return (
		<div className="overflow-x-auto">
			<table className="min-w-full bg-white">
				<thead className="bg-gray-100">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							ID
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Brand
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Logo
						</th>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
							Actions
						</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
					{brands.map((brand) => (
						<tr key={brand.id}>
							<td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
								{brand.id}
							</td>
							<td className="whitespace-nowrap px-6 py-4">
								<div className="text-sm font-medium text-gray-900">
									{brand.name}
								</div>
							</td>
							<td className="whitespace-nowrap px-6 py-4">
								<img
									src={brand.iconUrl || "/placeholder.svg"}
									alt={`${brand.name} logo`}
									className="h-10 w-10 rounded-full object-cover"
								/>
							</td>
							<td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
								<button
									onClick={() => onEdit(brand.id)}
									className="mr-4 text-blue-500 hover:text-blue-300"
								>
									Edit
								</button>
								<button
									onClick={() => onDelete(brand.id)}
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

export default BrandTable;
