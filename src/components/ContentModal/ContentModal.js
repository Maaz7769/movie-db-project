import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { img_500, unavailable, unavailableLandscape } from '../../config/config';
import YouTubeIcon from '@mui/icons-material/YouTube';
import '../ContentModal/ContentModal.css'
import Carousel from '../Carousel/Carousel';
import CloseIcon from '@mui/icons-material/Close';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '80%',
  bgcolor: '#39445a',
  border: '1px solid #282c34',
  borderRadius: 10,
  boxShadow: 24,
  p: 4,
  color: 'white',
};

export default function ContentModal({ children, media_type, id}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState();
  const [video, setVideo] = useState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchData =async () => {
    const { data } = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    )
    setContent(data);
  }
  const fetchVideo =async () => {
    const { data } = await axios.get(
        `https://api.themoviedb.org/3/${media_type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`
    );
    console.log(data);
    setVideo(data.results[0]?.key);
  }
  
  useEffect(() => {
    fetchData();
    fetchVideo();
    // eslint-disable-next-line
  },[])

  return (
    <>
      <div onClick={handleOpen}className='media'>{children}</div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>

           <CloseIcon className='closeIcon' fontSize='large' onClick={handleClose}/>
            {content && (
            <Box className='ContentModal'>
                <img className='ContentModal__portrait' alt={content.name || content.title} src={content.poster_path?`${img_500}/${content.poster_path}`:unavailable}/>
                <img className='ContentModal__landscape' alt={content.name || content.title} src={content.backdrop_path?`${img_500}/${content.backdrop_path}`:unavailableLandscape}/>
                <Box className='ContentModal__about'>
                    <span className='ContentModal__title'>{content.name || content.title}(
                        {(
                            content.first_air_date || content.release_data || '-----'
                        ).substring(0, 4)}
                    )
                    </span>
                    {content.tagline && (
                        <i className='tagline'>{' '}{content.tagline}</i>
                    )}
                    <span className='ContentModal__description'>
                        {content.overview}
                    </span>
                    <Box>
                        <Carousel media_type={media_type} id={id} />
                    </Box>
                    <Button
                    variant='contained'
                    startIcon={<YouTubeIcon />}
                    color='secondary'
                    target='_blank'
                    href={`https://www.youtube.com/watch?v=${video}`}
                    >Watch the Trailer</Button>
                </Box>
                
            </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}
