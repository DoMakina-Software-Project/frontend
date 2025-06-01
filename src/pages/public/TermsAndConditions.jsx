import { useState } from "react";

const TermsAndConditions = () => {
	const [activeSection, setActiveSection] = useState(null);

	const toggleSection = (sectionId) => {
		setActiveSection(activeSection === sectionId ? null : sectionId);
	};

	const sections = [
		{ id: "acceptance", title: "1. Acceptance of Terms" },
		{ id: "description", title: "2. Description of Services" },
		{ id: "responsibilities", title: "3. User Responsibilities" },
		{ id: "listing", title: "4. Listing and Promotions" },
		{ id: "transactions", title: "5. Transactions and Payments" },
		{ id: "suspension", title: "6. Account Suspension and Termination" },
		{ id: "liability", title: "7. Limitation of Liability" },
		{ id: "privacy", title: "8. Privacy and Data Protection" },
		{ id: "dispute", title: "9. Dispute Resolution" },
		{ id: "intellectual", title: "10. Intellectual Property" },
		{ id: "force-majeure", title: "11. Force Majeure" },
		{ id: "miscellaneous", title: "12. Miscellaneous" },
		{ id: "contact", title: "13. Contact Information" },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			<header className="bg-white shadow">
				<div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
					<h1 className="text-3xl font-bold text-gray-900">
						DoMakina Terms of Service
					</h1>
				</div>
			</header>
			<main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="flex flex-col gap-8 md:flex-row">
						<nav className="md:w-1/4">
							<div className="sticky top-6">
								<h2 className="mb-4 text-lg font-semibold">
									Table of Contents
								</h2>
								<ul className="space-y-2">
									{sections.map((section) => (
										<li key={section.id}>
											<a
												href={`#${section.id}`}
												className="text-blue-600 hover:underline"
												onClick={() =>
													toggleSection(section.id)
												}
											>
												{section.title}
											</a>
										</li>
									))}
								</ul>
							</div>
						</nav>
						<div className="md:w-3/4">
							<Section
								id="acceptance"
								title="1. Acceptance of Terms"
								isActive={activeSection === "acceptance"}
							>
								<p>
									Welcome to DoMakina, an online platform that
									facilitates the buying and selling of cars.
									By accessing or using our website, mobile
									application, or services (collectively, the
									Platform), you agree to comply with and be
									bound by these Terms of Service (Terms).
								</p>
								<p>
									If you do not agree with any part of these
									Terms, you must discontinue using DoMakina
									immediately. We reserve the right to update,
									modify, or replace these Terms at any time.
									Changes will be posted on the Platform, and
									continued use after such changes constitutes
									acceptance of the new Terms.
								</p>
							</Section>

							<Section
								id="description"
								title="2. Description of Services"
								isActive={activeSection === "description"}
							>
								<p>
									DoMakina provides a digital marketplace
									where individuals and businesses can list,
									browse, buy, and sell vehicles. Our services
									include but are not limited to:
								</p>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										Vehicle Listings: Users can create
										listings for cars they want to sell,
										including vehicle details, pricing, and
										images.
									</li>
									<li>
										Buyer-Seller Communication: Our platform
										allows users to connect, negotiate, and
										finalize transactions.
									</li>
									<li>
										Promotion Services: Sellers can promote
										their listings for better visibility
										through paid promotions.
									</li>
									<li>
										Price Estimations: Automated or manual
										pricing tools to help sellers determine
										fair market value.
									</li>
									<li>
										Secure Transactions: Integration with
										secure payment methods (if applicable).
									</li>
								</ul>
								<p>
									While we provide the platform for users to
									connect and transact, DoMakina is not
									responsible for any agreements, payments, or
									disputes between buyers and sellers.
								</p>
							</Section>

							<Section
								id="responsibilities"
								title="3. User Responsibilities"
								isActive={activeSection === "responsibilities"}
							>
								<p>
									By using DoMakina, you agree to the
									following:
								</p>
								<h3 className="mt-4 font-semibold">
									Accurate Information:
								</h3>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										Sellers must provide truthful and
										up-to-date details about vehicles,
										including price, condition, and legal
										ownership.
									</li>
									<li>
										Buyers must ensure they review all
										provided details before making
										purchases.
									</li>
								</ul>
								<h3 className="mt-4 font-semibold">
									Compliance with Laws:
								</h3>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										Users must comply with all applicable
										local, national, and international laws
										regarding vehicle sales, taxation, and
										ownership transfers.
									</li>
									<li>
										It is the responsibility of buyers and
										sellers to ensure all legal paperwork is
										handled correctly.
									</li>
								</ul>
								<h3 className="mt-4 font-semibold">
									User Conduct:
								</h3>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										You agree not to engage in fraudulent,
										misleading, or deceptive activities.
									</li>
									<li>
										You will not post illegal, stolen, or
										misrepresented vehicles.
									</li>
									<li>
										You will not spam, harass, or abuse
										other users on the platform.
									</li>
								</ul>
								<h3 className="mt-4 font-semibold">
									Security of Accounts:
								</h3>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										You are responsible for maintaining the
										confidentiality of your account
										credentials.
									</li>
									<li>
										DoMakina is not responsible for
										unauthorized account access caused by
										weak passwords or security breaches.
									</li>
								</ul>
								<p className="mt-4">
									Failure to comply with these
									responsibilities may result in suspension or
									termination of your account.
								</p>
							</Section>

							<Section
								id="listing"
								title="4. Listing and Promotions"
								isActive={activeSection === "listing"}
							>
								<h3 className="font-semibold">
									Creating a Listing:
								</h3>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										Sellers can list vehicles by providing
										required details such as make, model,
										year, condition, and price.
									</li>
									<li>
										Listings may be subject to approval
										before being published.
									</li>
								</ul>
								<h3 className="mt-4 font-semibold">
									Paid Promotions:
								</h3>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										Sellers can opt for paid promotions to
										boost their listings for better
										visibility.
									</li>
									<li>
										Promotion Pricing: The total cost is
										calculated based on the duration of the
										promotion and the applicable daily rate.
									</li>
									<li>
										Refund Policy: Promotions are
										non-refundable unless an error occurs
										due to our system.
									</li>
								</ul>
								<h3 className="mt-4 font-semibold">
									Listing Removal:
								</h3>
								<p>
									DoMakina reserves the right to remove any
									listing that violates these Terms or
									contains false/misleading information.
								</p>
							</Section>

							<Section
								id="transactions"
								title="5. Transactions and Payments"
								isActive={activeSection === "transactions"}
							>
								<h3 className="font-semibold">
									Buyer and Seller Responsibility:
								</h3>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										DoMakina does not handle payments
										directly. Buyers and sellers must
										coordinate payments and ownership
										transfers independently.
									</li>
									<li>
										We strongly recommend meeting in a
										secure location and verifying vehicle
										details before making payments.
									</li>
								</ul>
								<h3 className="mt-4 font-semibold">
									Third-Party Payment Services:
								</h3>
								<p>
									If DoMakina integrates payment services,
									users must comply with the payment
									provider&apos;s terms.
								</p>
								<h3 className="mt-4 font-semibold">
									Refunds and Disputes:
								</h3>
								<p>
									DoMakina does not provide refunds or
									mediation for private transactions. Disputes
									must be resolved between buyers and sellers.
								</p>
							</Section>

							<Section
								id="suspension"
								title="6. Account Suspension and Termination"
								isActive={activeSection === "suspension"}
							>
								<p>
									We reserve the right to suspend or terminate
									user accounts under the following
									conditions:
								</p>
								<ul className="list-disc space-y-2 pl-5">
									<li>Violation of these Terms.</li>
									<li>
										Engagement in fraudulent, illegal, or
										misleading activities.
									</li>
									<li>
										Misuse of the platform, including
										harassment or unauthorized data access.
									</li>
									<li>
										Repeated complaints from other users.
									</li>
								</ul>
								<p className="mt-4">
									If your account is terminated, you may lose
									access to your listings, messages, and
									history.
								</p>
							</Section>

							<Section
								id="liability"
								title="7. Limitation of Liability"
								isActive={activeSection === "liability"}
							>
								<p>
									To the fullest extent permitted by law,
									DoMakina is not liable for any direct,
									indirect, incidental, special,
									consequential, or exemplary damages
									resulting from:
								</p>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										False or misleading information in
										listings.
									</li>
									<li>
										Unsuccessful transactions, including
										fraud by third parties.
									</li>
									<li>
										Unauthorized access to your account or
										data.
									</li>
									<li>
										Service interruptions, errors, or
										downtime.
									</li>
								</ul>
								<p className="mt-4">
									We provide our services as is and as
									available without warranties of any kind,
									express or implied.
								</p>
							</Section>

							<Section
								id="privacy"
								title="8. Privacy and Data Protection"
								isActive={activeSection === "privacy"}
							>
								<p>
									By using DoMakina, you consent to our
									collection, storage, and processing of your
									personal data as described in our Privacy
									Policy. Key points:
								</p>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										We collect data to improve our services
										and user experience.
									</li>
									<li>
										We do not sell personal data to third
										parties for marketing purposes.
									</li>
									<li>
										We may share aggregated, non-personally
										identifiable data with partners for
										analysis.
									</li>
								</ul>
								<p className="mt-4">
									For details, refer to our Privacy Policy.
								</p>
							</Section>

							<Section
								id="dispute"
								title="9. Dispute Resolution"
								isActive={activeSection === "dispute"}
							>
								<p>
									If a dispute arises between you and another
									user, we encourage you to resolve it
									directly. DoMakina is not responsible for
									disputes, but in some cases, we may provide
									guidance.
								</p>
								<p className="mt-4">
									For legal disputes regarding our platform:
								</p>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										Mediation First: Users agree to attempt
										resolution through mediation before
										taking legal action.
									</li>
									<li>
										Jurisdiction: These Terms are governed
										by the laws of [Your Country/State], and
										any disputes must be settled in the
										courts of [Your Country/State].
									</li>
								</ul>
							</Section>

							<Section
								id="intellectual"
								title="10. Intellectual Property"
								isActive={activeSection === "intellectual"}
							>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										All content, trademarks, logos, and
										designs on DoMakina belong to us or our
										licensors.
									</li>
									<li>
										Users may not copy, modify, distribute,
										or use our content for commercial
										purposes without permission.
									</li>
									<li>
										By posting content (e.g., vehicle
										images, descriptions), you grant
										DoMakina a non-exclusive, royalty-free
										license to use, display, and promote the
										content on our platform.
									</li>
								</ul>
							</Section>

							<Section
								id="force-majeure"
								title="11. Force Majeure"
								isActive={activeSection === "force-majeure"}
							>
								<p>
									We are not responsible for service
									disruptions caused by events beyond our
									control, including but not limited to
									natural disasters, cyberattacks, government
									regulations, or infrastructure failures.
								</p>
							</Section>

							<Section
								id="miscellaneous"
								title="12. Miscellaneous"
								isActive={activeSection === "miscellaneous"}
							>
								<ul className="list-disc space-y-2 pl-5">
									<li>
										Severability: If any part of these Terms
										is found invalid, the remaining sections
										remain in effect.
									</li>
									<li>
										Waiver: Failure to enforce any part of
										these Terms does not waive our rights.
									</li>
									<li>
										Entire Agreement: These Terms, along
										with our Privacy Policy, form the entire
										agreement between you and DoMakina.
									</li>
								</ul>
							</Section>

							<Section
								id="contact"
								title="13. Contact Information"
								isActive={activeSection === "contact"}
							>
								<p>For inquiries or support, contact us at:</p>
								<ul className="mt-4 list-none space-y-2">
									<li>📧 Email: support@domakina.com</li>
									<li>📞 Phone: +3556868355</li>
									<li>📍 Address: Epoka University</li>
								</ul>
							</Section>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

const Section = ({ id, title, children, isActive }) => (
	<section id={id} className={`mb-8 ${isActive ? "" : "hidden"}`}>
		<h2 className="mb-4 text-2xl font-bold">{title}</h2>
		{children}
	</section>
);

export default TermsAndConditions;
