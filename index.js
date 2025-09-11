import express from 'express'

import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import { registerValidation } from './validations/auth.js'
import { validationResult } from 'express-validator'
import UserModel from './models/User.js'

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

app.use(express.json())

app.post('/auth/register', registerValidation, async (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json(errors.array())
	}

	// Шифруем пароль
	const password = req.body.password
	const salt = await bcrypt.genSalt(10)
	const passwordHash = await bcrypt.hash(password, salt)

	// Создаем пользователя
	const doc = new UserModel({
		email: req.body.email,
		fullName: req.body.fullName,
		avatarUrl: req.body.avatarUrl,
		email: req.body.email,
		passwordHash: req.body.email,
		passwordHash,
	})

	const user = await doc.save()

	res.json(user)
})

app.listen(4444, err => {
	if (err) {
		return console.log(err)
	}
	console.log('Server OK')
})
