import React, { useState, useEffect } from 'react';
import {
    Paper,
    Typography,
    Box,
    Button,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ResumePreview = ({ resume }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (resume?.fileUrl) {
            setPreviewUrl(resume.fileUrl);
        }
    }, [resume]);

    const handleDownload = async (version) => {
        try {
            const response = await fetch(version?.fileUrl || resume.fileUrl, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to download resume');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', version?.versionName || resume.originalFileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download resume:', error);
        }
    };

    if (!resume) {
        return (
            <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography>Upload a resume to see preview</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Resume Preview
            </Typography>

            {resume.versions?.length > 0 && (
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                    <Tabs
                        value={activeTab}
                        onChange={(e, newValue) => setActiveTab(newValue)}
                    >
                        <Tab label="Original" />
                        {resume.versions.map((version, index) => (
                            <Tab key={index} label={version.versionName} />
                        ))}
                    </Tabs>
                </Box>
            )}

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mt: 2
                }}
            >
                {resume.format === 'PDF' ? (
                    <Document
                        file={previewUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={<CircularProgress />}
                    >
                        <Page
                            pageNumber={pageNumber}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    </Document>
                ) : (
                    <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                            previewUrl
                        )}`}
                        width="100%"
                        height="600px"
                        frameBorder="0"
                        title="Resume Preview"
                    />
                )}

                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    {numPages > 1 && (
                        <>
                            <Button
                                disabled={pageNumber <= 1}
                                onClick={() => setPageNumber(pageNumber - 1)}
                            >
                                Previous
                            </Button>
                            <Typography>
                                Page {pageNumber} of {numPages}
                            </Typography>
                            <Button
                                disabled={pageNumber >= numPages}
                                onClick={() => setPageNumber(pageNumber + 1)}
                            >
                                Next
                            </Button>
                        </>
                    )}
                </Box>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDownload(resume.versions?.[activeTab - 1])}
                    sx={{ mt: 2 }}
                >
                    Download
                </Button>
            </Box>
        </Paper>
    );
};

export default ResumePreview;
