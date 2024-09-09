import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress, {
  circularProgressClasses,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function StatsComponent(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        sx={{
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
            stroke: '#93aa40'
          },
          '& .MuiCircularProgress-svg': {
            borderRadius: '65%'
          }
        }}
        size={100} variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

StatsComponent.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function CircularStatComponent(props) {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + 10;
        if (nextProgress >= props.value) {
          clearInterval(timer); // Clear the interval when progress reaches 100
          return props.value;
        } else {
          return nextProgress;
        }
      });
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <StatsComponent value={progress} />;
}