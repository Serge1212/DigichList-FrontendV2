import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { Adornment } from '../../Dialog/Inputs';

import FormStyle from '../../../auth/Style/FormStyle';
import { withStyles } from '@material-ui/core/styles';

import { Formik } from 'formik';
import * as Yup from 'yup';

class SetNewPassword extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: this.props.data,
			selectedId: this.props.data.id,
		};
	}
	render() {
		const { classes } = this.props;
		console.log(this.state.data);
		return (
			<Formik
				initialValues={{
					password: '',
					confirmPassword: '',
				}}
				validationSchema={Yup.object().shape({
					password: Yup.string()
						.min(6, 'Password must be at least 6 characters')
						.matches(/(?=.*[0-9])/, 'Password must contain a number.')
						.required('Password is required'),
					confirmPassword: Yup.string()
						.oneOf([Yup.ref('password'), null], 'Passwords must match')
						.required('Please confirm your password'),
				})}
				onSubmit={async (values) => {
					await fetch(
						`https://localhost:44379/api/admin/updateAdminPassword`,
						{
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								Accept: 'application/json',
							},
							body: JSON.stringify({
								id: this.state.selectedId,
								password: values.password,
							}),
						}
					).then((response) =>
						response.ok === true ? location.reload() : null
					);
				}}
			>
				{function (formik) {
					const [value, setValue] = React.useState({
						showPassword: false,
						showConfirmPassword: false,
					});
					const handleClickShowPassword = () => {
						setValue({ showPassword: !value.showPassword });
					};
					const handleClickShowConfirmPassword = () => {
						setValue({ showConfirmPassword: !value.showConfirmPassword });
					};
					return (
						<form onSubmit={formik.handleSubmit} className={classes.form}>
							<div>
								<MuiDialogContent dividers>
									<TextField
										error={
											formik.errors.password ==
											'Password must be at least 6 characters'
										}
										className={classes.formInput}
										variant='outlined'
										margin='normal'
										helperText={formik.errors.password}
										{...formik.getFieldProps('password')}
										fullWidth
										size='small'
										label='Password'
										type={value.showPassword ? 'text' : 'password'}
										id='password'
										InputProps={{
											endAdornment: (
												<Adornment
													value={value.showPassword}
													handleClickShowPassword={handleClickShowPassword}
													handleClearInput={() =>
														formik.setFieldValue('password', '')
													}
												/>
											),
										}}
									/>
									<TextField
										error={
											formik.errors.confirmPassword ==
											'Password must be at least 6 characters'
										}
										className={classes.formInput}
										variant='outlined'
										margin='normal'
										helperText={formik.errors.confirmPassword}
										{...formik.getFieldProps('confirmPassword')}
										fullWidth
										size='small'
										label='Confirm Password'
										type={value.showConfirmPassword ? 'text' : 'password'}
										id='confirmPassword'
										InputProps={{
											endAdornment: (
												<Adornment
													value={value.showConfirmPassword}
													handleClickShowPassword={
														handleClickShowConfirmPassword
													}
													handleClearInput={() =>
														formik.setFieldValue('confirmPassword', '')
													}
												/>
											),
										}}
									/>
								</MuiDialogContent>
								<MuiDialogActions>
									<Button
										size='small'
										className={classes.submitBtn}
										type='submit'
										disableRipple
										variant='contained'
									>
										Save
									</Button>
								</MuiDialogActions>
							</div>
						</form>
					);
				}}
			</Formik>
		);
	}
}

SetNewPassword.propTypes = {
	data: PropTypes.object,
	classes: PropTypes.object,
};

export default withStyles(FormStyle, { withTheme: true })(SetNewPassword);
