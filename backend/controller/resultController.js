import resultModel from "../models/resultModel.js";

const addResult = async(req, res)=>{
    try {
        const{wpm, accuracy, errorCount, text} = req.body;
        const user = req.user._id;
        if(!wpm || !accuracy || errorCount == undefined || !user || !text) 
           { console.log('all fields are required to save the data');
            return res.status(400).json({success: false, message: "All fields are required"});
    }
        const result = await resultModel.create({wpm, accuracy, errorCount, user, text});
        console.log('result saved successfully')
        return res.status(201).json({
            success:true,
            message: "Result added successfully",
            result
        });
    } catch (error) {
        console.log('result add error');
        return res.status(500).json({success: false, message: "Server Error"});
    }
}

const getUserResult = async(req, res) =>{
    try {
        const user = req.user._id;
        const result = await resultModel.find({user})
                      .sort({createdAt : -1})
                      .populate('text','name difficulty');

       if(user)
        {
            console.log('result fetched');
            return res.status(200).json({
            success:true,
            message: "Result fetched successfully",
            data:result});   }           
        
    } catch (error) {
        console.log('result fetch error');
        return res.status(500).json({success: false, message:'Server Errror'});
        
    }
}

const getLeaderboard = async (req, res) => {
    try {
        const { difficulty } = req.query; // Get optional difficulty from query string
       
        let pipeline = [

            {
                $lookup: {
                    from: 'texts',
                    localField: 'text',
                    foreignField: '_id',
                    as: 'textDetails'
                }
            },
            { $unwind: '$textDetails' }
        ];

       
        if (difficulty && ['easy', 'medium', 'hard'].includes(difficulty)) {
            pipeline.push({
                $match: {
                    'textDetails.difficulty': difficulty
                }
            });
        }

        
        pipeline.push(
            { $sort: { wpm: -1 } },
            {
                $group: {
                    _id: "$user",
                    bestResultId: { $first: "$_id" },
                    maxWpm: { $first: "$wpm" },
                    accuracy: { $first: "$accuracy" },
                    text: { $first: "$text" },
                    textDetails: { $first: "$textDetails" },
                    createdAt: { $first: "$createdAt" }
                }
            },
            { $sort: { maxWpm: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'userDetails' } },
            { $unwind: '$userDetails' },
            {
                $project: {
                    _id: '$bestResultId',
                    wpm: '$maxWpm',
                    accuracy: 1,
                    user: { name: '$userDetails.name' },
                    text: { name: '$textDetails.name' },
                    createdAt: 1
                }
            }
        );

        const leaderboard = await resultModel.aggregate(pipeline);

        return res.status(200).json({
            success: true,
            message: "Leaderboard fetched successfully",
            data: leaderboard
        });

    } catch (error) {
        console.error("Leaderboard Error:", error);
        return res.status(500).json({ success: false, message: 'Server Error' });
    }
};


const getUserRank = async(req, res) =>{
    try{
        const user = req.user._id;
        const bestScore = await resultModel.findOne({user})
                           .sort({wpm: -1})

         if (!bestScore) {
            return res.status(200).json({
                success: true,
                message: "User has not completed any tests yet.",
                rank: "N/A"
            });
        }     
        const userWPM = bestScore.wpm; 

        const higherRanker = await resultModel.aggregate([
            {
                $group:{
                     _id: "$user",
                     maxwpm : {$max: '$wpm'}
                } 
            },
            {
                $match:{
                    maxwpm: {$gt: userWPM}
                }
            },
            {
                $count: 'higherRanker'
            }
        ])   // this will return an array of size 1 [{higherRanker: 5}]
         
        const rank = higherRanker.length > 0 ? higherRanker[0].higherRanker + 1 : 1;
   
         return res.status(200).json({
            success: true,
            message: "User rank fetched successfully",
            rank: rank,
            bestScore: userWPM
        });

    }
    catch(error){
        console.log('user rank fetch error');
        return res.status(500).json({success: false, message:'Server Errror'});
    }
}

const getUserRankByDifficulty = async(req, res) =>{
    try {
        const user = req.user._id;
        const {difficulty} = req.params;

        if(!['easy','medium','hard'].includes(difficulty)){
            return res.status(400).json({success: false, message:'Invalid difficulty'});    
        }
        const userBestResult = await resultModel.aggregate([
            { $lookup: { from: 'texts', localField: 'text', foreignField: '_id', as: 'textDetails' } },
            { $unwind: '$textDetails' },
            { $match: { 'textDetails.difficulty': difficulty, user: user } },
            { $sort: { wpm: -1 } },
            { $limit: 1 }
        ]);

        if(userBestResult.length === 0){
            return res.status(200).json({
                success: true,
                message: "User has not completed any tests yet.",
                rank: "N/A"
            });
        }

        const userBestWpm = userBestResult[0].wpm;

       const higherRanker = await resultModel.aggregate([
            { $lookup: { from: 'texts', localField: 'text', foreignField: '_id', as: 'textDetails' } },
            { $unwind: '$textDetails' },
            { $match: { 'textDetails.difficulty': difficulty } },
            { $group: { _id: "$user", maxWpm: { $max: "$wpm" } } },
            { $match: { maxWpm: { $gt: userBestWpm } } },
            { $count: "higherRanks" }
        ]);

        const rank = higherRanker.length > 0 ? higherRanker[0].higherRanks + 1 : 1;

        return res.status(200).json({
            success: true,
            message: "User rank fetched successfully",
            rank: rank,
            bestScore: userBestWpm
        });
        
    } catch (error) {
        res.status(500).json({success: false, message:'Server Errror'});
    }
}

export {addResult, getUserResult, getLeaderboard, getUserRank};


