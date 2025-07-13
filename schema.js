// const Joi = require('joi');

// const listingSchema = Joi.object({
//   listing : Joi.object({
//     title: Joi.string().required(),
//     description: Joi.string().required(),
//     country: Joi.string().required(),
//     location: Joi.string().required(),
//     price: Joi.number().required().min(0),
//     image: Joi.object({
//       url: Joi.string().uri().required(),
//       filename: Joi.string().required() 
//     }).required()
//   })
// });

const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow('').optional(),
    country: Joi.string().required(),
    location: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: Joi.object({
      url: Joi.string().uri().allow('').optional(),
      filename: Joi.string().allow('').optional()    
    }).optional()
  }).required()
});
module.exports = { listingSchema };



module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
});