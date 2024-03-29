import React,{useState} from 'react'
import {useHistory} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import {Avatar,Button,Paper,Grid,Typography,Container} from '@material-ui/core'
import {GoogleLogin} from 'react-google-login'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import useStyles from './styles'
import Input from './Input'
import Icon from './Icon'
import {signin,signup} from '../../reducer/actions/auth'

const initialState={
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    confirmPassword:''
}

const Auth = () => {
    const classes = useStyles();
    const history=useHistory();

    const dispatch = useDispatch()
    const [isSignup,setIsSignup] = useState(false)
    const [formData, setFormData] = useState(initialState)

    const [showPassword,setShowPassword] = useState(false)

    const handleSubmit=(e)=>{
        e.preventDefault();
        // console.log(formData)
        if(isSignup){
            dispatch(signup(formData,history))
        }else{
            dispatch(signin(formData,history))
        }
    }

    const handleChange=(e)=>{
        const value= e.target.value;
        setFormData({...formData,
        [e.target.name]:value})

    }
    const handleShowPassword=()=>{
        setShowPassword((prevShowPassword)=> !prevShowPassword)
    }
    const switchMode=()=>{
        setIsSignup(!isSignup)
    }
    // Google LogIn
    const googleSuccess= async(res)=>{
        const result = res?.profileObj;
        const token = res?.tokenId;
        try{
            dispatch({type:'AUTH', data:{result,token}})
            history.push('/')
        }catch(error){
            console.log(error);
        }
        console.log(res)
    }
    const googleFailure=()=>{
        console.log('Google SignIn was Unsuccessful. Try again Later')
    }


    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h5" variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>

        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            { isSignup && (
            <>
              <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
              <Input name="lastName" label="Last Name" handleChange={handleChange} half />
            </>
            )}
            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
            { isSignup && <Input name="confirmPassword" label="Repeat Password" handleChange={handleChange} type="password" /> }
          </Grid>
          <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
            { isSignup ? 'Sign Up' : 'Sign In' }
          </Button>

          {/* Google Log In Component React-google-Logincd*/}
          <GoogleLogin
          clientId="462089094917-4tfkq2arn3pukbh9ultqkojcjl3sjh47.apps.googleusercontent.com"
          render={(renderProps)=>(
              <Button className={classes.googleButton} fullWidth color="primary" onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon/>} variant="contained">
                Google SignIn
              </Button>
          )}
          onSuccess={googleSuccess}
          onFailure={googleFailure}
          cookiePolicy="single_host_origin"
          />

          <Grid container justifyContent="center">
              <Grid type="item">
                  <Button onClick={switchMode}>
                      {isSignup ? 'Already Have an account ? Sign in':'Dont have an account'}
                  </Button>
              </Grid>
          </Grid>
        
          
        </form>
            </Paper>

        </Container>
    )
}

export default Auth
