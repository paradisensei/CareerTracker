'use strict';

const Contract = require('../models/Contract');
const Error = require('../models/Error');

/**
 * @swagger
 * /contracts/{role}/{address}:
 *   get:
 *     x-swagger-router-controller:
 *       contracts
 *     operationId:
 *       read
 *     tags:
 *       - Contracts
 *     description: Возвращает контракты пользователя с заданным адресом
 *     security:
 *       - BasicAuth: []
 *     x-security-scopes:
 *       - all
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: role
 *         description: Роль пользователя
 *         in: path
 *         required: true
 *         type: string
 *         enum: [emp, org]
 *       - name: address
 *         description: Ethereum адрес пользователя
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Список контрактов пользователя
 *         schema:
 *           $ref: '#/definitions/Contract'
 *       500:
 *         description: Системная ошибка
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
async function read(req, res, next){
  const role = req.swagger.params.role.value;
  const address = req.swagger.params.address.value.toLowerCase();

  let contracts;
  try {
    if (role === 'emp') {
      contracts = await Contract.getEmpContracts(address);
    } else if (role === 'org') {
      contracts = await Contract.getOrgContracts(address);
    } else {
      throw new Error.InternalError();
    }
  }catch(e){
    next(e);
  }

  res
    .status(200)
    .json(contracts);
}

/**
 * @swagger
 * /contracts:
 *   post:
 *     x-swagger-router-controller:
 *       contracts
 *     operationId:
 *       create
 *     tags:
 *       - Contracts
 *     description: Создает новый контракт
 *     security:
 *       - BasicAuth: []
 *     x-security-scopes:
 *       - all
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: data
 *         in: body
 *         description: Данные контракта
 *         schema:
 *           type: object
 *           required:
 *             - details
 *             - org
 *             - orgSig
 *             - emp
 *           properties:
 *             details:
 *               type: string
 *               description: Ссылка на зашифрованные детали соглашения в IPFS
 *             org:
 *               type: string
 *               description: Адрес организации
 *             orgSig:
 *               type: string
 *               description: Подпись организации
 *             emp:
 *               type: string
 *               description: Адрес соискателя
 *     responses:
 *       200:
 *         description: Объект созданного контракта
 *         schema:
 *           $ref: '#/definitions/Contract'
 *       500:
 *         description: Системная ошибка
 *         schema:
 *           $ref: '#/definitions/InternalError'
 */
async function create(req, res, next){
  const data = req.swagger.params.data.value;
  data.org = data.org.toLowerCase();
  data.emp = data.emp.toLowerCase();

  try {
    const contract = await Contract.create(data);

    res
      .status(200)
      .json(contract);
  }catch(e){
    next(e);
  }
}

module.exports = { read, create };