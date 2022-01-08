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

// Vérification recherche utilisateur
const searchUserSchema = Joi.string().trim();
exports.searchUser = (req, res, next) => {
  const {error, value} = searchUserSchema.validate(req.query.name);
  if (error) {
      res.status(422).json({ error: "Données saisies invalides" });
  } else {
      next();
  } 
}

// Vérification description utilisateur
const outlineSchema = Joi.string().trim().required();
exports.outline = (req, res, next) => {
  const {error, value} = outlineSchema.validate(req.body.outline);
  if (error) {
      res.status(422).json({ error: "Description invalide" });
  } else {
      next();
  }
}

// Vérification changement de mot de passe
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().trim().min(8).required(),
  newPassword: Joi.string().trim().min(8).required()
});
exports.changePassword = (req, res, next) => {
  const {error, value} = changePasswordSchema.validate(req.body);
  if (error) {
    res.status(422).json({ error: "Données saisies invalides" });
  } else {
    next();
  }
};

// Vérification droit utilisateur
const adminCredentialSchema = Joi.valid(0, 1).required();
exports.adminCredential = (req, res, next) => {
    const {error, value} = adminCredentialSchema.validate(req.body.isadmin);
    if (error) {
        res.status(422).json({ error: "Données saisies invalides" });
    } else {
        next();
    }
}

// Vérification publication d'un post
const postContentSchema = Joi.string().trim();
exports.postContent = (req, res, next) => {
    if (req.body.content) {
        const {error, value} = postContentSchema.validate(req.body.content);
        if (error) {
        res.status(422).json({ error: "Données saisies invalides" });
        } else {
            next();
        }
    } else if (!req.body.content && !req.file) {
        res.status(422).json({ error: "Envoyer au moins une image ou un texte !" });
    } else {
        next();
    }
};

// Vérification récupération d'un partie des publications
const getPostsSchema = Joi.object({
    limit: Joi.number().integer().positive().required(),
    offset: Joi.number().integer().min(0).required()
});
exports.getSomePosts = (req, res, next) => {
    const {error, value} = getPostsSchema.validate(req.params);
    if (error) {
        res.status(422).json({ error: "Données saisies invalides" });
    } else {
        next();
    }
};
  
// Vérification publication d'un commentaire
const commentSchema = Joi.object({
    postId: Joi.number().integer().positive().required(),
    content: Joi.string().trim().required()
});
exports.comment = (req, res, next) => {
    const {error, value} = commentSchema.validate(req.body);
    if (error) {
        res.status(422).json({ error: "Commentaire invalide" });
    } else {
        next();
    }
};
  
// Vérification lors de la récupération des commentaires d'un post
const postIdSchema = Joi.number().integer().positive().required();
exports.postId = (req, res, next) => {
    const {error, value} = postIdSchema.validate(req.body.postId);
    if (error) {
        res.status(422).json({ error: "id de la publication invalide" });
    } else {
        next();
    }
};