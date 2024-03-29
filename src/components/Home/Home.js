import React, { useEffect, useState } from 'react'
import {useHistory,useLocation} from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { Container, Grid, Grow, Paper,AppBar,TextField,Button } from '@material-ui/core'
import ChipInput from 'material-ui-chip-input'
import { getPosts,getPostsBySearch } from '../../reducer/actions/posts'
import Form from '../Form/Form'
import Pagination from '../Pagination'
import Posts from '../Posts/Posts'
import useStyles from './styles'

function useQuery(){
  return new URLSearchParams(useLocation().search)
}

  const Home = () => {
  const classes = useStyles();
  const query = useQuery();
  const dispatch = useDispatch();
  const history = useHistory();

  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery')

  const [currentId, setCurrentId] = useState(null);
  const [search, setSearch] = useState('');
  const [tags, setTags] = useState([])

  useEffect(()=>{
    dispatch(getPosts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch,currentId])

  // console.log(currentId)
  
  const searchPost = () => {
    if (search.trim() || tags) {
      console.log(({ search, tags: tags.join(',') }))
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    } else {
      history.push('/');
    }
  };
  
  const handleKeyPress=(e)=>{
    if(e.keycode === 13){
      
      searchPost()
    }
  }

  const handleAddChip=(tag)=>{
    setTags([...tags,tag])
  }

  const handleDeleteChip=(tagToDelete)=>{
    setTags(tags.filter(tag=>tag !== tagToDelete))
  }

    return (
      <Grow in>
        <Container maxWidth="xl">
          <Grid container justifyContent="space-between" alignItems="flex-start" spacing={3} className={classes.gridContainer}>
            <Grid item xs={12} sm={6} md={9}>
              <Posts setCurrentId={setCurrentId}/>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppBar className={classes.appBarSearch} position="static" color="inherit">
                <TextField 
                name="search" 
                variant="outlined"
                label = "Search Memories"
                fullWidth
                value = {search}
                onChange={(e)=>setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                />
                <ChipInput
                style={{margin: '10px 0'}}
                variant="outlined"
                value={tags}
                onAdd={handleAddChip}
                onDelete={handleDeleteChip}
                label="Search Tags"
                />
                <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search Post</Button>
              </AppBar>
              <Form currentId={currentId}  setCurrentId={setCurrentId}/>
                {(!searchQuery && !tags.length)&&(
                <Paper className={classes.pagination} elevation={6}>
                  <Pagination page={page}/>
                </Paper>
                )}
            </Grid>
          </Grid>
        </Container>

      </Grow>
    )
}

export default Home
