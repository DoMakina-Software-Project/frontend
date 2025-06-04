import { MainLayout } from "../../../components/layouts";
import { Button, Input } from "../../../components/ui";
import { updateStaff, getStaffById } from "../../../api/admin";
import { useState, useEffect } from "react";
import { useApi } from "../../../hooks";
import { useNavigate, useParams } from "react-router-dom";
import { clearErrors } from "../../../utils/form";

const initialState = {
	name: { value: "", error: "" },
	surname: { value: "", error: "" },
};

const EditStaffPage = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { handleApiCall: getStaffApiCall } = useApi(getStaffById);
	const { handleApiCall: updateStaffApiCall, loading: loadingUpdateStaff } =
		useApi(updateStaff, {
			onValidationError: (error) => {
				setFormState((prev) => {
					const newState = { ...prev };
					error.forEach((err) => {
						newState[err.path].error = err.msg;
					});
					return newState;
				});
			},
		});

	const [formState, setFormState] = useState(initialState);

	useEffect(() => {
		getStaffApiCall({ id }).then((data) => {
			if (data) {
				setFormState({
					name: { value: data.name, error: "" },
					surname: { value: data.surname, error: "" },
				});
			}
		});
	}, [id]);

	const handleUpdateStaff = async (e) => {
		e.preventDefault();
		if (loadingUpdateStaff) return;
		clearErrors(setFormState);

		const { name, surname } = formState;

		const response = await updateStaffApiCall({
			id,
			data: {
				name: name.value,
				surname: surname.value,
			},
		});

		if (response) {
			navigate("/admin/staff");
		}
	};

	return (
		<MainLayout>
			<div className="flex flex-grow items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<form
						onSubmit={handleUpdateStaff}
						className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10"
					>
						<div className="flex flex-col items-center justify-center space-y-1">
							<h1 className="text-[26px]">Edit Staff Member</h1>
							<p className="text-[13px] text-theme-light-gray">
								Update the staff member&apos;s information.
							</p>
						</div>
						<div className="flex w-full flex-col space-y-1.5">
							<Input
								type="text"
								placeholder="Name"
								name="name"
								formState={formState}
								setFormState={setFormState}
								required
								minLength={2}
								maxLength={100}
							/>
							<Input
								type="text"
								placeholder="Surname"
								name="surname"
								formState={formState}
								setFormState={setFormState}
								required
								minLength={2}
								maxLength={100}
							/>
						</div>
						<Button type="submit" className="w-full">
							Update
						</Button>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default EditStaffPage;
