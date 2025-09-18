import express from 'express'

import mongoose from 'mongoose'

import {
	registerValidation,
	loginValidation,
	postCreateValidation,
} from './validations.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from './controllers/UserController.js'
import * as PostController from './controllers/PostController.js'
import multer from 'multer'
import handleValidationErrors from './utils/handleValidationErrors.js'

mongoose
	.connect(
		'mongodb+srv://kolodchenkoVitaly:kolodchenkoVit19@cluster0.hqh18zh.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0'
	)
	.then(() => {
		console.log('db ok')
	})
	.catch(err => {
		console.log('db error', err)
	})

const app = express()

// Create a storage for files' uploads
const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},

	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })

app.use(express.json())
app.use('/uploads/', express.static('uploads'))

//User
app.post(
	'/auth/login',
	loginValidation,
	handleValidationErrors,
	UserController.login
)
app.post(
	'/auth/register',
	registerValidation,
	handleValidationErrors,
	UserController.register
)
app.get('/auth/me', checkAuth, UserController.getMe)

//Files' upload
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`,
	})
})

//Posts
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, PostController.update)

app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Server OK')
})

/*
{
    "email": "888test@test.ru",
    "fullName": "Georg Ivanovich",
    "password": "45678",
    "avatarUrl": "https://www.youtube.com/watch?v=GQ_pTmcXNrQ"
}
*/
