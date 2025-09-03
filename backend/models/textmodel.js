import mongoose from "mongoose";

const textsSchema = new mongoose.Schema({
    name : { type : String,
              required : true
           },
    content: { type: String,
               required: true,
               trim : true,
               minlength: 100,
             },
             
    difficulty : {
              type : String,
              enum:['easy', 'medium','hard'],
              required: true,
              
    },    

    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    }    
},{
  timestamps: true 
})

const textModel = mongoose.models.Text || mongoose.model('Text', textsSchema);
export default textModel;