const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const mime = require("mime");
const fs = require("fs")

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		await new User({ ...req.body, password: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

router.put("/saveData", async (req,res) => {
	let {
		data
	} = req.body;

	try{

		let profileData = data.profilePicture.data;
		delete data.profilePicture.data;
		let coverData = data.coverPicture.data;
		delete data.coverPicture.data;

		let output = profileData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
		let extension = mime.extension(output[1]);

		let base64Data = Buffer.from(output[2], 'base64');

		fs.writeFile(`uploads/${data.profilePicture.name}`, base64Data, 'utf8', async (err) => {
			if(err)
				throw new Error(err.message);
		});

		if(coverData)
		{
			output = coverData.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
			extension = mime.extension(output[1]);

			base64Data = Buffer.from(output[2], 'base64');

			fs.writeFile(`uploads/${data.coverPicture.name}`, base64Data, 'utf8', async (err) => {
				if(err)
					throw new Error(err.message);
				delete data.coverPicture.data;
			});
		}

		console.log("Saving ...")

		let results = await User.findOneAndUpdate(
			{email:data.email},
			{$set:data},
			{new: true},
			(err, doc) => {
				if (err)
					throw new Error(err.message);
				return doc;
			}
		).clone();


		return res.status(200).json({data:results})
	}
	catch(error)
	{
		console.log(error.message)
		return res.status(500).send({ message: "Internal Server Error" });
	}
})

module.exports = router;
