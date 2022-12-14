import { BadRequestError, InternalServerError, NotFoundError } from '../errors/errors.js'
import { read, write } from "../utils/model.js"
import { ParamValidation, subCategoryPostValidation, subCategoryPutValidation } from '../validation/validation.js'



const GET = (req, res, next) => {
  try {
    const allSubCategories = read('subcategories').filter(sub => delete sub.categoryId)
    const allProducts = read('products')

    allSubCategories.map(e => e.products = allProducts.filter(j => e.subCategoryId == j.subCategoryId).filter(d => delete d.subCategoryId) )


    res.status(200).json({
      message: "SubCategories",
      data: allSubCategories
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

    const allSubCategories = read('subcategories')
    const allProducts = read('products')

    const foundSubCategory = allSubCategories.find(e => e.subCategoryId == id)
    delete foundSubCategory.categoryId

    foundSubCategory.products = allProducts.filter(e => e.subCategoryId == id).filter(i => delete i.subCategoryId)

    res.status(200).json({
      message: "subcategory by id",
      data: foundSubCategory
    })
  } catch (error) {
    return next(new InternalServerError(500, 'Internal server error'))
  }
}

const POST = (req, res, next) => {
  try {
    const { error, value } = subCategoryPostValidation.validate(req.body)

  if(error) {
    next(new BadRequestError(400, error.message))
    return
  }

  const subcategories = read('subcategories')

  const { categoryId, subCategoryName } = value

  const newSubcategory = {
    subCategoryId : subcategories.at(-1)?.subCategoryId + 1 || 1,
    categoryId,
    subCategoryName
  }
  if(subcategories) subcategories.push(newSubcategory)

  write('subcategories', subcategories)

   res.status(201).json({
    message: "subcategory has been created"
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

  const {error: putError, value: putValue } = subCategoryPutValidation.validate(req.body)

  const subCategories = read('subcategories')

  const foundSubCategory = subCategories.find(e => e.subCategoryId == id)

  if(putError) {
    return next(new BadRequestError( 400,error.message))
  }

  const { categoryId, subCategoryName } = putValue


  if(!foundSubCategory) {
    return next(new NotFoundError(404, `Subcategory with this ${id} id is not found`))
  }

  foundSubCategory.categoryId = categoryId || foundSubCategory.categoryId
  foundSubCategory.subCategoryName = subCategoryName || foundSubCategory.subCategoryName



  const updated = write('subcategories', subCategories)

  if(updated)  res.status(201).json({
    message: "subcategory has been updated"
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

  const subCategories = read('subcategories')

  const index = subCategories.findIndex(e => e.subCategoryId == id)

  if(index == -1) {
    return next(new NotFoundError(404,`Subcategory with this ${id} id is not found`))
  }

  subCategories.splice(index, 1)

  const deleted = write('subcategories', subCategories)

  if(deleted)  res.status(200).json({
    message: "subcategory has been deleted"
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