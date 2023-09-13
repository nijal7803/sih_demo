const express = require('express');
const router = express.Router();
const Proposal = require('../models/proposal');
const User = require('../models/user'); 
const { authenticateUser, checkUserRole } = require('../middleware/authMiddleware'); 


router.get('/proposals/assigned', authenticateUser, checkUserRole(['Faculty']), async (req, res) => {
  try {
    
    const facultyId = req.user._id;

    
    const proposals = await Proposal.find({ faculty: facultyId });

    res.json({ proposals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve assigned proposals.' });
  }
});


router.put('/proposals/:id/approve', authenticateUser, checkUserRole(['Faculty']), async (req, res) => {
  try {
    const proposalId = req.params.id;
    const decision = req.body.decision;

    
    const facultyId = req.user._id;

    
    const proposal = await Proposal.findOne({ _id: proposalId, faculty: facultyId });

    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found or not assigned to you.' });
    }

    
    proposal.approvalDecision = decision;
    proposal.approvalStatus = decision; 

    await proposal.save();

    res.json({ message: 'Proposal decision updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update the proposal decision.' });
  }
});

module.exports = router;
