import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { Stack, IconButton, InputAdornment, Alert } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
// Moralis
import {useMoralis,useMoralisCloudFunction} from "react-moralis";

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const { register } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const { signup, isAuthenticated, user ,authError,Moralis } = useMoralis();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const {
    fetch: callEmailCloudFunction,
    data,
    error,
    isLoading,
  } = useMoralisCloudFunction(
    "sendWelcomeEmail",
    {
      email: email,
      name: username,
    },
    { autoFetch: false }
  );

  const sendWelcomeEmail = () => {
    //pick the user email from state
    callEmailCloudFunction();
  };

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    confirmpassword:Yup.string().oneOf([Yup.ref('password')],"Password not matched").required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,

    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await register(data.email, data.password);
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', error);
      }
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <Alert severity="info" sx={{ mb: 3 }}>
              Use strong password <strong> 8 caracteres minimum </strong> with numbers, symbols, capital letters
            </Alert>
        {authError && ( <Alert severity="error">{authError.message}</Alert>)}

        <RHFTextField name="username" value={username} onChange={(event) => setUsername(event.currentTarget.value)} label="Username" />
        <RHFTextField name="email" value={email} onChange={(event) => setEmail(event.currentTarget.value)} label="Email address" />

        <RHFTextField value={password} onChange={(event) => setPassword(event.currentTarget.value)}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
         <RHFTextField
          name="confirmpassword"
          label="Confirm Password"
          type={showPassword ? 'text' : 'password'}
        />

        <LoadingButton onClick={() => {signup(username, password, email);sendWelcomeEmail()
           }} fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          Register
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}
