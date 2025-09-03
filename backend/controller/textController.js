import textModel from "../models/textmodel.js";

const addText = async (req, res) => {
  try {
    const { name, content, difficulty } = req.body;
    if (!name || !content || !difficulty) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const text = await textModel.create({
      name,
      content,
      difficulty,
      submittedBy: req.user._id,
    });
    res.status(200).json({ text });
  } catch (error) {
    console.log("text add error");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const getRandomText = async (req, res) => {
  try {
    const texts = await textModel.find({}).limit(10);
    const randomIndex = Math.floor(Math.random() * texts.length);
    const randomText = texts[randomIndex];
    console.log('random text fetched')
    res.status(200)
      .json({
        success: true,
        message: "Text fetched successfully",
         id:randomText._id,
         name : randomText.name,
        content : randomText.content
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// also for filtering by difficulty
const getAllTexts = async (req, res) => {
  try {
    const { difficulty } = req.query;

    const query = {};
    if (difficulty) query.difficulty = difficulty;
    const texts = await textModel.find(query);
    res.status(200).json({success: true, message: "Texts fetched successfully", data: texts});
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getTextById = async (req, res) => {
  try {
    const text = await textModel.findById(req.params.id);
    if (text) {
      res.status(200).json(text);
    } else res.status(400).json({ message: "Text not found" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Issue" });
  }
};

const deleteText = async (req, res) => {
  try {
    const text = await textModel.findById(req.params.id);

    if (!text) {
      return res.status(404).json({ message: "Text not found" });
    }

    if (text.submittedBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await text.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Text deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export { addText, getAllTexts, getTextById, deleteText, getRandomText };
