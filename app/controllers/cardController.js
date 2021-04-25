const { Card, List } = require('../models');
const { Op } = require('sequelize');
const sanitizeHtml = require('sanitize-html');

module.exports = {

    getAllCardsInList: async (request, response, next) => {
        try {
            const listId = parseInt(request.params.id, 10);

            if (isNaN(listId)) {
                return next();
            }

            const list = await List.findByPk(listId);

            if (!list) {
                return next();
            }

            const cards = await list.getCards({
                include: 'tags',
                order: [
                    ['position', 'ASC'],
                ]
            });

            response.json(cards);
        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }

    },

    getOneCard: async (request, response, next) => {
        try {
            const id = parseInt(request.params.id, 10);
            if (isNaN(id)) {
                return next();
            }

            const card = await Card.findByPk(id, {
                include: 'tags'
            });

            if (!card) {
                return next();
            }

            response.json(card);

        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }
    },

    createCard: async (request, response) => {

        try {

            const data = request.body;

            const errors = [];

            data.list_id = parseInt(data.list_id, 10);

            if (isNaN(data.list_id)) {
                errors.push(`list_id must be an integer`);
            } else {
                const list = await List.findByPk(data.list_id);

                if (!list) {
                    errors.push(`The list of the card does not exist`);
                }
            }
         
            
            if (!data.content) {
                errors.push(`content can't be empty`);
            } else if (data.content.length < 3) {
                errors.push(`content must have at least 3 caracters`);
            }
            
            if (data.position) {
                data.position = parseInt(data.position, 10);
                if (isNaN(data.position)) {
                    errors.push(`position must be a number`);
                }
            }

            if (errors.length > 0) {
                return response.status(400).json({ errors });
            }


            data.content = sanitizeHtml(data.content);

            const card = await Card.create(data);
            response.status(201).json(card);

        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }

    },

    updateCard: async (request, response, next) => {
        try {

            const id = parseInt(request.params.id, 10);

            if (isNaN(id)) {
                return next();
            }

            const card = await Card.findByPk(id);

            if (!card) {
                return next();
            }

            const data = request.body;

            const errors = [];

            if (typeof data.list_id !== 'undefined') {
                data.list_id = parseInt(data.list_id, 10);

                if (isNaN(data.list_id)) {
                    errors.push(`list_id must be an integer`);
                } else {
                    const list = await List.findByPk(data.list_id);

                    if (!list) {
                        errors.push(`The list of the card does not exist`);
                    }
                }
            }

            if (typeof data.content !== 'undefined') {
                if (data.content === '') {
                    errors.push(`content can't be empty`);
                } else if (data.content.length < 3) {
                    errors.push(`content must have at least 3 caracters`);
                }
            }

            if (data.position) {
                data.position = parseInt(data.position, 10);
                if (isNaN(data.position)) {
                    errors.push(`position must be a number`);
                }
            }

            if (errors.length > 0) {
                return response.status(400).json({ errors });
            }

            //On assaini les valeurs texte
            data.content = sanitizeHtml(data.content);

            const cardSaved = await card.update(data);

            response.json(cardSaved);

        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }
    },

    deleteCard: async (request, response, next) => {

        try {

            const id = parseInt(request.params.id, 10);

            if (isNaN(id)) {
                return next();
            }

            const card = await Card.findByPk(id);

            if (!card) {
                return next();
            }

            await card.destroy();
            response.status(204).json();
        } catch (error) {
            console.trace(error);
            response.status(500).json({ error: `Server error, please contact an administrator` });
        }
    }

}