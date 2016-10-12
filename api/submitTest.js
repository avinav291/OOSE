
var Test=require('../models/Test.js');
var mongoose=require('mongoose');

//Requires the following at submission
//testId
//User: name, email, score
//Post Request

function existsEmail(examineeEmail, examineeArray){

	for (examinee in examineeArray){
		if(examinee['email']==examineeEmail)
			return false
	}
	return true
}

module.exports = function(req, res){

	var testId=mongoose.Types.ObjectId(req.body.testId);

	Test.findById(testId, '_id examinee', function(err, test){

		if(err){
			console.log('Test ID:' + testId +':\n'+err);
			res.json({'error':err});
		}

		else if(!existsEmail(req.body.email, test.examinee)){
			console.log('User already registered');
			res.json({'error':'User already Registered'});
		}

		Test.findOneAndUpdate({_id:req.body.testId},{
			$push:{examinee:{name:req.body.name,email:req.body.email,score:req.body.score}}
		}, {new : true}, function(err, updatedTest){

			if(err || !updatedTest){
				res.json({"error":"Could not update Scores"});
				return;
			}

			res.json(updatedTest);
		});
	})

};