import React, { useEffect, useState } from 'react'
import useStyles from './styles'
import {TextField,Typography,Paper, Button} from '@material-ui/core'
import FileBase64 from 'react-file-base64'
import { createPost, updatePost } from '../../reducer/actions/posts'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

const Form = ({currentId,setCurrentId}) => {
    const[postData, setPostData] = useState({
        title:'',
        message:'',
        tags:'',
        selectedFile:''
    })
    const history = useHistory();
    const classes = useStyles();
    const dispatch= useDispatch();
    const post = useSelector(state => (currentId? state.posts.posts.find((message)=> message._id === currentId): null));
    const user = JSON.parse(localStorage.getItem('profile'))

    // console.log(post)
    

    useEffect(()=>{
        if(post){
            setPostData(post)
        }
            // eslint-disable-next-line react-hooks/exhaustive-deps

    },[post])


    const handleSubmit= async(e) =>{
        e.preventDefault();
        if(currentId){
            dispatch(updatePost(currentId,{...postData, name: user?.result?.name}))
        }else{
            dispatch(createPost({...postData, name: user?.result?.name}),history)     
        }
        setCurrentId(null);
        clear()
    }
    if(!user?.result?.name){
        return(
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Please  Sign In to Create your own memories and like other's memories
                </Typography>
            </Paper>
        )
    }
    
    const clear=()=>{
        setPostData({
            title:'',
            message:'',
            tags:'',
            selectedFile:''
        })
        setCurrentId(null)
    }

    return (
        <Paper className={classes.paper} elevation={6}>
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">Creating a memory</Typography>
        <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} />
        <TextField name="message" variant="outlined" label="Message" fullWidth multiline rows={4} value={postData.message} onChange={(e) => setPostData({ ...postData, message: e.target.value })} />
        <TextField name="tags" variant="outlined" label="Tags (coma separated)" fullWidth value={postData.tags} onChange={(e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
        <div className={classes.fileInput}><FileBase64 type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>{currentId ? 'update':'submit'}</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
        </form>
        </Paper>
    )
}

export default Form
