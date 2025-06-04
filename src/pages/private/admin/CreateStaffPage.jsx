import { MainLayout } from "../../../components/layouts";
import { Button, Input } from "../../../components/ui";
import { createStaff } from "../../../api/admin";
import { useState } from "react";
import { useApi } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { clearErrors } from "../../../utils/form";

const initialState = {
	email: { value: "", error: "" },
	name: { value: "", error: "" },
	surname: { value: "", error: "" },
};

const CreateStaffPage = () => {
	const { handleApiCall: createStaffApiCall, loading: loadingCreateStaff } =
		useApi(createStaff, {
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

	const navigate = useNavigate();
	const [formState, setFormState] = useState(initialState);

	const resetForm = () => {
		setFormState(initialState);
	};

	const handleCreateStaff = async (e) => {
		e.preventDefault();
		if (loadingCreateStaff) return;
		clearErrors(setFormState);

		const { email, name, surname } = formState;

		const response = await createStaffApiCall({
			email: email.value,
			name: name.value,
			surname: surname.value,
		});

		if (response) {
			resetForm();
			navigate("/admin/staff");
		}
	};

	return (
		<MainLayout>
			<div className="flex flex-grow items-center justify-center">
				<div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl bg-white px-6 py-16 shadow-sm">
					<form
						onSubmit={handleCreateStaff}
						className="flex w-full max-w-[300px] flex-col items-center justify-center space-y-10"
					>
						<div className="flex flex-col items-center justify-center space-y-1">
							<h1 className="text-[26px]">Create Staff Member</h1>
							<p className="text-[13px] text-theme-light-gray">
								Please provide the details for the new staff
								member.
							</p>
						</div>
						<div className="flex w-full flex-col space-y-1.5">
							<Input
								type="email"
								placeholder="Email"
								name="email"
								formState={formState}
								setFormState={setFormState}
								required
							/>
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
						<Button
							type="submit"
							className="w-full"
							loading={loadingCreateStaff}
						>
							Create Staff Member
						</Button>
					</form>
				</div>
			</div>
		</MainLayout>
	);
};

export default CreateStaffPage;
