import React from 'react';
import { Box, Skeleton, Paper, Grid } from '@mui/material';

const ResumeAnalysisSkeleton = () => {
  return (
    <Box sx={{ animation: 'fadeIn 0.8s ease-in-out' }}>
      {/* Header Section */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 2,
        }}
      >
        <Skeleton variant="text" width="40%" height={40} />
        <Skeleton variant="text" width="20%" height={24} sx={{ mt: 1 }} />
      </Paper>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Column - Resume Preview */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={400} />
          </Paper>
        </Grid>

        {/* Right Column - Analysis */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: 2,
            }}
          >
            <Skeleton variant="text" width="40%" height={32} sx={{ mb: 2 }} />
            
            {/* Analysis Sections */}
            {Array(3).fill(0).map((_, index) => (
              <Box key={index} sx={{ mb: 3 }}>
                <Skeleton variant="text" width="50%" height={28} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="95%" height={20} />
              </Box>
            ))}

            {/* Keywords */}
            <Box sx={{ mt: 4 }}>
              <Skeleton variant="text" width="30%" height={28} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {Array(8).fill(0).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    width={80}
                    height={32}
                    sx={{
                      animation: 'pulse 1.5s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%': { opacity: 0.6 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0.6 },
                      },
                      animationDelay: `${index * 0.1}s`,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <style>
        {`
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  );
};

export default ResumeAnalysisSkeleton;
