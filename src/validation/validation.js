import Joi from 'joi'


export const ParamValidation = Joi.object().keys({
  id: Joi.number().required()
})

export const categoryPostValidation = Joi.object().keys({
  categoryName: Joi.string().required().max(20).min(3)
})

export const categoryPutValidation = Joi.object().keys({
  categoryName: Joi.string().max(20).min(3)
})
export const subCategoryPostValidation = Joi.object().keys({
  categoryId: Joi.number().required(),
  subCategoryName: Joi.string().required().max(20).min(3)
})

export const subCategoryPutValidation = Joi.object().keys({
  categoryId: Joi.number(),
  subCategoryName: Joi.string().max(20).min(3)
})

export const productPostValidation = Joi.object().keys({
  subCategoryId: Joi.number().required(),
  productName: Joi.string().max(20).min(3).required(),
  price: Joi.string().max(15).required(),
  color: Joi.string().required().max(10).min(3),
  model: Joi.string().required().max(20).min(3)
})

export const productPutValidation = Joi.object().keys({
  subCategoryId: Joi.number(),
  model: Joi.string().max(20).min(3),
  productName: Joi.string().max(20).min(3),
  color: Joi.string().max(10).min(3),
  price: Joi.string().max(15)
})



//subCategoryId, productName, price, color, model