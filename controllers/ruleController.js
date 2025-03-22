import Rule from '../models/Rule.js'; // Assuming you have a Rule model

// Create a new AML rule
const createAMLRule = async (ruleData) => {
  try {
    const newRule = new Rule({
      title: ruleData.title,
      source: ruleData.source,
      link: ruleData.link,
      createdAt: new Date(),
    });

    await newRule.save();
    console.log('Rule saved:', newRule);
  } catch (error) {
    console.error('Error creating AML rule:', error);
  }
};

// Get all AML rules
const getRules = async (req, res) => {
  try {
    const rules = await Rule.find();
    res.json(rules);
  } catch (error) {
    console.error("Error getting rules:", error);
    res.status(500).send("Server Error");
  }
};

// Delete a rule
const deleteRule = async (req, res) => {
  try {
    const { id } = req.params;
    await Rule.findByIdAndDelete(id);
    res.send("Rule deleted");
  } catch (error) {
    console.error("Error deleting rule:", error);
    res.status(500).send("Server Error");
  }
};

// Add a new rule manually (if the user approves)
const addRule = async (req, res) => {
  try {
    const newRule = new Rule(req.body);
    await newRule.save();
    res.json(newRule);
  } catch (error) {
    console.error("Error adding rule:", error);
    res.status(500).send("Server Error");
  }
};

export { createAMLRule, getRules, deleteRule, addRule };
