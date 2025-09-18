import PostModel from '../models/Post.js'

// Get all posts
export const getAll = async (req, res) => {
	try {
		const posts = await PostModel.find().populate('user').exec()
		// .populate({ path: 'user', select: ['name', 'avatar'] })

		res.json(posts)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось получить статьи ',
		})
	}
}

// Get one post
export const getOne = async (req, res) => {
	try {
		const postId = req.params.id

		const post = await PostModel.findOneAndUpdate(
			{ _id: postId },
			{ $inc: { viewsCount: 1 } },
			{ returnDocument: 'after' }
		).populate('user')

		if (!post) {
			return res.status(404).json({
				message: 'Статья не найдена',
			})
		}

		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось вернуть статью',
		})
	}
}

//Post remove
export const remove = async (req, res) => {
	try {
		const postId = req.params.id

		const post = await PostModel.findByIdAndDelete(postId)

		if (!post) {
			return res.status(404).json({
				message: 'Статья не найдена',
			})
		}

		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось удалить статью',
		})
	}
}

//Post Creation
export const create = async (req, res) => {
	try {
		const doc = new PostModel({
			title: req.body.title,
			text: req.body.text,
			ImageUrl: req.body.imageUrl,
			tags: req.body.tags,
			user: req.userId,
		})

		const post = await doc.save()

		res.json(post)
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось создать статью',
		})
	}
}

export const update = async (req, res) => {
	try {
		const postId = req.params.id

		const post = await PostModel.findByIdAndUpdate(
			{
				_id: postId,
			},
			{
				title: req.body.title,
				text: req.body.text,
				ImageUrl: req.body.imageUrl,
				user: req.userId,
				tags: req.body.tags,
			}
		)

		res.json({
			success: true,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось обновить статью',
		})
	}
}
