import * as Yup from 'yup';
import { useState } from 'react';
// next
import NextLink from 'next/link';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

// moralis
import {useMoralis} from "react-moralis";

// ----------------------------------------------------------------------

export default function LoginForm() {
  
  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const {authenticate,authError,logout,login, isAuthenticating,Moralis}=useMoralis();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleCustomLogin = async () => {
    await authenticate({
      provider: "web3Auth",
      clientId: "BCM2YywXK_8Chk_5utpVYET4s5NtyQ4Dx0K1ylw3D_5lgmGdm4DHLDV3ww8e0D0SxMXNhCKoBSy-JFyg91x_6EU",
    });
  };

  
    
    async function authWalletConnect() {
      const user = authenticate({
        provider: "walletconnect",
        chainId: 56,
        mobileLinks: [
          "metamask",
          "trust",
          "rainbow",
          "argent",
          "imtoken",
          "pillar",
        ],
        signingMessage: "Welcome!",
      });
      console.log(user);
    }


  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: 'demo@minimals.cc',
    password: 'demo1234',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    // try {
    //   await login(data.email, data.password);
    // } catch (error) {
    //   console.error(error);
    //   reset();
    //   if (isMountedRef.current) {
    //     setError('afterSubmit', error);
    //   }
    // }
  };

  

  return (
    <>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
      <Stack spacing={3}>
        {authError && (<Alert severity="error">{authError.message}</Alert>)}


        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            )
          }} />


      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <NextLink href={PATH_AUTH.resetPassword} passHref>
          <Link variant="subtitle2">Forgot password?</Link>
        </NextLink>
      </Stack>

      <Box mt={2}>
        <LoadingButton fullWidth size="large" type="submit" variant="contained">
          Login
        </LoadingButton>
      </Box>

     
      <Box mt={2}>
        <LoadingButton onClick={() => { authenticate()} } fullWidth size="large" type="submit" variant="contained" >
          Login with MetaMask
        </LoadingButton>
      </Box>

      
      <Box mt={2}>
        <LoadingButton onClick={handleCustomLogin} fullWidth size="large"  variant="contained">
          Login with Web3Auth
        </LoadingButton>
      </Box>
    
    <Box mt={2}>
        <LoadingButton onClick={() => authWalletConnect()} fullWidth size="large" type="submit" variant="contained">
          Login with Wallet connect
        </LoadingButton>
    </Box>
     

    </FormProvider>
    
    </>

     
  );
}
