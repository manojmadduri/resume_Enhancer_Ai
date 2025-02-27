import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Box,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

const CustomizationPanel = ({ resume, onUpdate }) => {
    const [selectedFont, setSelectedFont] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('');
    const [versionName, setVersionName] = useState('');

    const fonts = [
        'Arial',
        'Times New Roman',
        'Calibri',
        'Helvetica',
        'Georgia',
        'Garamond'
    ];

    const themes = [
        'Professional',
        'Modern',
        'Creative',
        'Traditional',
        'Minimalist'
    ];

    const handleSaveCustomization = async () => {
        try {
            const response = await fetch('/api/resume/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    resumeId: resume._id,
                    versionName,
                    customizations: {
                        font: selectedFont,
                        theme: selectedTheme
                    }
                })
            });

            if (!response.ok) {
                throw new Error('Failed to save customization');
            }

            const data = await response.json();
            onUpdate(data);
        } catch (error) {
            console.error('Failed to save customization:', error);
        }
    };

    if (!resume) {
        return (
            <Paper sx={{ p: 2 }}>
                <Typography>Please upload a resume to customize</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Customize Your Resume
            </Typography>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>AI Suggestions</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <List>
                        {resume.aiSuggestions?.map((suggestion, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={suggestion.section}
                                    secondary={suggestion.suggestion}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        color={suggestion.implemented ? 'primary' : 'default'}
                                    >
                                        {suggestion.implemented ? <CheckIcon /> : <CloseIcon />}
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Keywords</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {resume.keywords?.map((keyword, index) => (
                            <Chip key={index} label={keyword} />
                        ))}
                    </Box>
                </AccordionDetails>
            </Accordion>

            <Box sx={{ mt: 3 }}>
                <TextField
                    fullWidth
                    label="Version Name"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Font</InputLabel>
                    <Select
                        value={selectedFont}
                        onChange={(e) => setSelectedFont(e.target.value)}
                        label="Font"
                    >
                        {fonts.map((font) => (
                            <MenuItem key={font} value={font}>
                                {font}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Theme</InputLabel>
                    <Select
                        value={selectedTheme}
                        onChange={(e) => setSelectedTheme(e.target.value)}
                        label="Theme"
                    >
                        {themes.map((theme) => (
                            <MenuItem key={theme} value={theme}>
                                {theme}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleSaveCustomization}
                >
                    Save Customization
                </Button>
            </Box>
        </Paper>
    );
};

export default CustomizationPanel;
