'use strict';

const User = require('../models/User');

/**
 * @swagger
 * /user/{address}:
 *   get:
 *     x-swagger-router-controller:
 *       user
 *     operationId:
 *       read
 *     tags:
 *       - User
 *     description: Возвращает пользователя по заданному адресу
 *     security:
 *       - BasicAuth: []
 *     x-security-scopes:
 *       - all
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: address
 *         description: Ethereum адрес пользователя
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Объект пользователя
 *         schema:
 *           $ref: '#/definitions/User'
 *       404:
 *         description: Пользователь не найден
 *         schema:
 *           $ref: '#/definitions/NotFoundError'
 *       500:
 *         description: Системная ошибка
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
async function read(req, res, next){
  const address = req.swagger.params.address.value.toLowerCase();

  try {
    const user = await User.byAddress(address);
    res
      .status(200)
      .json(user);
  }catch(e){
    next(e);
  }
}

/**
 * @swagger
 * /user:
 *   post:
 *     x-swagger-router-controller:
 *       user
 *     operationId:
 *       create
 *     tags:
 *       - User
 *     description: Создает нового пользователя
 *     security:
 *       - BasicAuth: []
 *     x-security-scopes:
 *       - all
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         description: Данные пользователя
 *         schema:
 *           type: object
 *           required:
 *             - address
 *             - name
 *             - surname
 *             - inn
 *             - role
 *           properties:
 *             address:
 *               type: string
 *               description: Ethereum адрес
 *             name:
 *               type: string
 *               description: имя
 *             surname:
 *               type: string
 *               description: фамилия
 *             email:
 *               type: string
 *               description: e-mail
 *             inn:
 *               type: number
 *               description: ИНН
 *             role:
 *               type: string
 *               enum: [emp, org]
 *               description: роль (соискатель/работодатель)
 *     responses:
 *       200:
 *         description: Объект созданного пользователя
 *         schema:
 *           $ref: '#/definitions/User'
 *       400:
 *         description: Пользователь с такими данными уже существует
 *         schema:
 *           $ref: '#/definitions/AlreadyExistError'
 *       500:
 *         description: Системная ошибка
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
async function create(req, res, next){
  const data = req.swagger.params.data.value;

  try {
    const user = await User.create(data);

    res
      .status(200)
      .json(user);
  }catch(e){
    next(e);
  }
}

module.exports = { read, create };