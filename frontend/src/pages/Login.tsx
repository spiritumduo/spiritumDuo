import React from 'react';

interface LoginPageProps {

}

export const LoginPage = ({ }: LoginPageProps) => (
	<div className="vh-100">
		<section className="vh-100">
			<div className="container py-5 h-100">
				<div className="row d-flex justify-content-center align-items-center h-100">
					<div className="card shadow-2-strong col-12 col-md-8 col-lg-6 col-xl-5">
						<div className="card-body p-5">
							<div className="form-group mb-2">
								<label>Please enter credentials below to access Spiritum Duo</label>
							</div>

							<div className="form-group row mb-2">
								<label className="col-sm-3 col-form-label">Username</label>
								<div className="col-sm-9">
								<input type="text" className="form-control" placeholder="john.doe" />
								</div>
							</div>

							<div className="form-group row mb-4">
								<label className="col-sm-3 col-form-label">Password</label>
								<div className="col-sm-9">
								<input type="password" className="form-control" placeholder="********" />
								</div>
							</div>

							<button type="submit" className="btn btn-outline-secondary w-50 float-end">Login</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
);