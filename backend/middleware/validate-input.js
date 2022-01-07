// Importation modules
const Joi = require('joi');

// Validation création nouvel utilisateur
const newUserSchema = Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).required()
});
exports.newUser = (req, res, next) => {
    const {error, value} = newUserSchema.validate(req.body);
    if (error) {
        res.status(422).json({ error: "Données saisies invalides" });
    } else {
        next();
    }
};

// Validation login utilisateur
const loginSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).required()
});
exports.login = (req, res, next) => {
    const {error, value} = loginSchema.validate(req.body);
    if (error) {
        res.status(422).json({ error: "email ou mot de passe invalide" });
    } else {
        next();
    }
};

// Vérification Id
const idSchema = Joi.number().integer().positive().required();
exports.id = (req, res, next) => {
    const {error, value} = idSchema.validate(req.params.id);
    if (error) {
        res.status(422).json({ error: "id invalide" });
    } else {
        next();
    } 
}