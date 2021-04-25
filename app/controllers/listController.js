const { List } = require('../models/');
const { Op } = require('sequelize');
const sanitizeHtml = require('sanitize-html');

module.exports = {

    getAllLists: async (request, response) => {
        try {
            const lists = await List.findAll({
                include: {
                    association: 'cards',
                    include: 'tags'
                },
                order: [
                    ['position', 'ASC'],
                    ['cards', 'position', 'ASC']
                ]
            });
            response.json(lists);
        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }

    },

    getOneList: async (request, response, next) => {
        try {
            const id = parseInt(request.params.id, 10);
            if (isNaN(id)) {
                return next();
            }

            const list = await List.findByPk(id, {
                include: {
                    association: 'cards',
                    include: 'tags'
                }
            });

            if (!list) {
                return next();
            }

            response.json(list);

        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }
    },

    createList: async (request, response) => {

        try {

            const data = request.body;

            const errors = [];

            if (!data.name) {
                errors.push(`name can't be empty`);
            } else if (data.name.length < 3) {
                errors.push(`name must have at least 3 caracters`);
            }

            if (data.position) {
                data.position = parseInt(data.position, 10);
                if (isNaN(data.position)) {
                    errors.push(`position must be a number`);
                }
            }

            const listExists = await List.findOne({
                where: {
                    name: data.name
                }
            });

            if (listExists) {
                errors.push(`This name of list is already in use`);
            }

            if (errors.length > 0) {
                return response.status(400).json({ errors });
            }

            data.name = sanitizeHtml(data.name);
 
            const list = await List.create(data);
            response.status(201).json(list);

        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }

    },

    updateList: async (request, response, next) => {
        try {

            const id = parseInt(request.params.id, 10);

            if (isNaN(id)) {
                return next();
            }

            const list = await List.findByPk(id);

            if (!list) {
                return next();
            }

            const data = request.body;

            const errors = [];

            if (typeof data.name !== 'undefined') {
                if (data.name === '') {
                    errors.push(`name can't be empty`);
                } else if (data.name.length < 3) {
                    errors.push(`name must have at least 3 caracters`);
                }
            }

            if (data.position) {
                data.position = parseInt(data.position, 10);
                if (isNaN(data.position)) {
                    errors.push(`position must be a number`);
                }
            }

            if (data.name) {
                const listExists = await List.findOne({
                    where: {
                        id: {
                            [Op.ne]: id
                        },
                        name: data.name
                    }
                });

                if (listExists) {
                    errors.push(`This name of list is already in use on another list`);
                }
            }

            if (errors.length > 0) {
                return response.status(400).json({ errors });
            }

            
            if(data.name) data.name = sanitizeHtml(data.name);

            const listSaved = await list.update(data);

            response.json(listSaved);

        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }
    },

    deleteList: async (request, response, next) => {

        try {

            const id = parseInt(request.params.id, 10);

            if (isNaN(id)) {
                return next();
            }

            const list = await List.findByPk(id);

            if (!list) {
                return next();
            }

            await list.destroy();
            response.status(204).json();
        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }
    }

}