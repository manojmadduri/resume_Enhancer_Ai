const Profile = require('../models/Profile');

exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findByUserId(req.user.id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        res.json({
            success: true,
            profile: {
                firstName: profile.first_name,
                lastName: profile.last_name,
                title: profile.title,
                bio: profile.bio,
                phone: profile.phone,
                location: profile.location,
                linkedinUrl: profile.linkedin_url,
                githubUrl: profile.github_url,
                portfolioUrl: profile.portfolio_url,
                skills: profile.skills,
                experienceYears: profile.experience_years,
                preferredJobTypes: profile.preferred_job_types,
                preferredLocations: profile.preferred_locations,
                createdAt: profile.created_at,
                updatedAt: profile.updated_at
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Error fetching profile'
        });
    }
};

exports.createProfile = async (req, res) => {
    try {
        const existingProfile = await Profile.findByUserId(req.user.id);
        if (existingProfile) {
            return res.status(400).json({
                success: false,
                error: 'Profile already exists'
            });
        }

        const profile = await Profile.create(req.user.id, req.body);
        res.status(201).json({
            success: true,
            profile: {
                firstName: profile.first_name,
                lastName: profile.last_name,
                title: profile.title,
                bio: profile.bio,
                phone: profile.phone,
                location: profile.location,
                linkedinUrl: profile.linkedin_url,
                githubUrl: profile.github_url,
                portfolioUrl: profile.portfolio_url,
                skills: profile.skills,
                experienceYears: profile.experience_years,
                preferredJobTypes: profile.preferred_job_types,
                preferredLocations: profile.preferred_locations,
                createdAt: profile.created_at,
                updatedAt: profile.updated_at
            }
        });
    } catch (error) {
        console.error('Create profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Error creating profile'
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const profile = await Profile.update(req.user.id, req.body);
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        res.json({
            success: true,
            profile: {
                firstName: profile.first_name,
                lastName: profile.last_name,
                title: profile.title,
                bio: profile.bio,
                phone: profile.phone,
                location: profile.location,
                linkedinUrl: profile.linkedin_url,
                githubUrl: profile.github_url,
                portfolioUrl: profile.portfolio_url,
                skills: profile.skills,
                experienceYears: profile.experience_years,
                preferredJobTypes: profile.preferred_job_types,
                preferredLocations: profile.preferred_locations,
                createdAt: profile.created_at,
                updatedAt: profile.updated_at
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Error updating profile'
        });
    }
};

exports.deleteProfile = async (req, res) => {
    try {
        const profile = await Profile.delete(req.user.id);
        if (!profile) {
            return res.status(404).json({
                success: false,
                error: 'Profile not found'
            });
        }

        res.json({
            success: true,
            message: 'Profile deleted successfully'
        });
    } catch (error) {
        console.error('Delete profile error:', error);
        res.status(500).json({
            success: false,
            error: 'Error deleting profile'
        });
    }
};
