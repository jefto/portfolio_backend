const express = require('express');
const router = express.Router();
const { getAllSkills, getSkillById, createSkill, updateSkill, deleteSkill } = require('../controllers/skillController');

router.get('/', getAllSkills);
router.get('/:id', getSkillById);
router.post('/', createSkill);
router.put('/:id', updateSkill);
router.delete('/:id', deleteSkill);

module.exports = router;

