import React, { Component } from 'react';
import { Grid, Paper, Container } from '@mui/material'
import Carousel from 'react-material-ui-carousel'

class ImageCarousal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid container>
        <Carousel className='slide'>
          {
            this.props.setSliders.map((item, i) => <Item key={i} item={item} />)
          }
        </Carousel>
      </Grid>
    )
  }
}

export default ImageCarousal;

function Item(props) {
  return (
    <Paper>
      <Container>
        <Grid container mt={4}>
          <Grid item xs>
            <img src={props.item} />
          </Grid>
        </Grid>
      </Container>
    </Paper>
  )
}
