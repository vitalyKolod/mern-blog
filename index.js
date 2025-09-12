import express from 'express'
import jwt from 'jsonwebtoken'
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

//Авторизация
app.post('auth/login', async (req, res) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email })

		if (!user) {
			return res.status(404).json({
				message: 'Пользователь не найден',
			})
		}
		const isValidPass = await bcrypt.compare(
			req.body.password,
			user._doc.password
		)

		if (!isValidPass) {
			return res.status(404).json({
				message: 'Неверный логин или пароль',
			})
		}
		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)
		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось авторизоваться',
		})
	}
})

// Регистрация
app.post('/auth/register', registerValidation, async (req, res) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json(errors.array())
		}

		// Шифруем пароль
		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		const hash = await bcrypt.hash(password, salt)

		// Создаем пользователя
		const doc = new UserModel({
			email: req.body.email,
			fullName: req.body.fullName,
			avatarUrl: req.body.avatarUrl,
			passwordHash: hash,
		})

		const user = await doc.save()

		const token = jwt.sign(
			{
				_id: user._id,
			},
			'secret123',
			{
				expiresIn: '30d',
			}
		)

		const { passwordHash, ...userData } = user._doc
		res.json({
			...userData,
			token,
		})
	} catch (err) {
		console.log(err)
		res.status(500).json({
			message: 'Не удалось зарегистрироваться',
		})
	}
})

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
