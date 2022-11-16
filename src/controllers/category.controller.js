import path from 'path'
import { BadRequestError, InternalServerError, NotFoundError } from '../errors/errors.js'
import { read, write } from "../utils/model.js"
import { categoryPostValidation, categoryPutValidation, ParamValidation } from '../validation/validation.js'



const GET = (req, res, next) => {
  try {
    const allCategories = read('categories')
    const allSubCategories = read('subcategories')

    allCategories.map(e => e.subCategories = allSubCategories.filter(j => e.categoryId == j.categoryId).filter(d => delete d.categoryId))

    res.status(200).json({
      message: "Categories",
      data: allCategories
    })
  } catch (error) {
    return next(new InternalServerError(500, 'Internal server error'))
  }
}

const GETBYID = (req, res, next) => {
  try {

    const { error, value } = ParamValidation.validate(req.params)

    if(error) {
     return next(new BadRequestError(error.message, 400))
    }

    const { id } = value

    const allCategories = read('categories')
    const allSubCategories = read('subcategories')

    const foundCategory = allCategories.find(e => e.categoryId == id)

    foundCategory.subCategories = allSubCategories.filter(e => e.categoryId == id).filter(i => delete i.categoryId)

    res.status(200).json({
      message: "category by id",
      data: foundCategory
    })
  } catch (error) {
    return next(new InternalServerError(500, 'Internal server error'))
  }
}

const POST = (req, res, next) => {
  try {
    const { error, value } = categoryPostValidation.validate(req.body)

  if(error) {
    next(new BadRequestError(400, error.message))
    return
  }

  const categories = read('categories')

  const { categoryName } = value

  const newCategory = {
    categoryId : categories.at(-1)?.categoryId + 1 || 1,
    categoryName
  }
  if(categories) categories.push(newCategory)

  write('categories', categories)

   res.status(201).json({
    message: "Category has been created"
  })

  } catch (error) {
    return next(new InternalServerError(500, 'Internal server error'))
  }
}

const PUT = (req, res, next) => {
  try {
    const { error, value } = ParamValidation.validate(req.params)

  if(error) {
    return next(new BadRequestError( 400,error.message))
  }

  const { id } = value

  const {error: putError, value: putValue } = categoryPutValidation.validate(req.body)

  const categories = read('categories')

  const foundCategory = categories.find(e => e.categoryId == id)

  if(putError) {
    return next(new BadRequestError( 400,error.message))
  }

  const { categoryName } = putValue

  if(!foundCategory) {
    return next(new NotFoundError(404, `Job with this ${id} id is not found`))
  }

  foundCategory.categoryName = categoryName || foundCategory.categoryName


  const updated =write('categories', categories)

  if(updated)  res.status(201).json({
    message: "category has been updated"
  })
  } catch (error) {
    return next(new InternalServerError(500, 'Internal server error'))
  }

}

const DELETE = (req, res, next) => {
  try {
    const { error, value } = ParamValidation.validate(req.params)

  if(error) {
    return next(new BadRequestError(400, error.message))
  }

  const { id } = value

  const categories = read('categories')

  const index = categories.findIndex(e => e.categoryId == id)

  if(index == -1) {
    return next(new NotFoundError(404,`Job with this ${id} id is not found`))
  }

  categories.splice(index, 1)

  const deleted =write('categories', categories)

  if(deleted)  res.status(200).json({
    message: "category has been deleted"
  })
  } catch (error) {
    return next(new InternalServerError(500, 'Internal server error'))
  }
}


export default {
  GET,
  GETBYID,
  POST,
  PUT,
  DELETE
}