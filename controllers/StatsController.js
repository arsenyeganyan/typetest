const User = require('../models/User');
const Test = require('../models/Test');

exports.getAllTests = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if(!user) {
            return res.status(404).json({ msg: "A user with such id does not exist!" });
        }

        const tests = await Test.find({ belongsTo: userId });

        res.status(200).json({ tests });
    } catch(err) {
        res.status(500).json({ error: 'Error while fetching tests!', details: err.message });
    }
}

exports.addTest = async (req, res, next) => {
    const { userId, wpm, accuracy } = req.body;

    if(!wpm || !accuracy) {
        res.status(400).json({ msg: "Words per minute and accuracy are required!" });
    }

    try {
        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).json({ msg: "A user with such id does not exist!" });
        }

        const test = new Test({ wordsPerMinute: wpm, accuracy, belongsTo: userId });
        await test.save();

        let allTests = await Test.find();

        if(allTests.length >= 100) {
            allTests = allTests.slice(-10);
        }

        res.status(200).json({ msg: 'Test results added successfully.' });
    } catch(err) {
        res.status(500).json({ error: 'Error while adding test!', details: err.message });
    }
}