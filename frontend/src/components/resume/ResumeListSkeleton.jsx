import React from 'react';
import { Box, Skeleton, Paper } from '@mui/material';

const ResumeListSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, index) => (
        <Paper
          key={index}
          elevation={2}
          sx={{
            p: 3,
            mb: 2,
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            animation: 'fadeIn 0.5s ease-in-out',
            '@keyframes fadeIn': {
              '0%': {
                opacity: 0,
                transform: 'translateY(10px)',
              },
              '100%': {
                opacity: 1,
                transform: 'translateY(0)',
              },
            },
            animationDelay: `${index * 0.1}s`,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="60%" height={32} />
            <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', sm: 'flex-end' },
              minWidth: { sm: '200px' },
            }}
          >
            <Skeleton variant="rounded" width={90} height={36} />
            <Skeleton variant="rounded" width={90} height={36} />
          </Box>
        </Paper>
      ))}
    </>
  );
};

export default ResumeListSkeleton;
