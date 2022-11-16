import path from 'path'
import sha256 from "sha256"
import jwt from "../utils/jwt.js"
import { BadRequestError, InternalServerError, NotFoundError } from '../errors/errors.js'
import { read, write } from "../utils/model.js"
import { ParamValidation, productPostValidation, productPutValidation } from '../validation/validation.js'



const GET = (req, res, next) => {
  try {
    const products = read('products')
    const subCategories = read('subcategories')
    const categories = read('categories')


    const { categoryId, subCategoryId, model } = req.query

    if(!categoryId && !subCategoryId && !model) res.send([])
    if(categoryId) {

     const foundCategories = categoryId ?  categories.filter(e => e.categoryId == categoryId) : null

     const foundSubCategories = subCategories.filter(e =>  foundCategories.find(j => j.categoryId == e.categoryId))

     const foundProducts = products.filter(e => (foundSubCategories.find(j => e.subCategoryId == j.subCategoryId)) ? foundSubCategories.find(j => e.subCategoryId == j.subCategoryId): null)

     return res.status(200).json({
      message: "Products by category id",
      data: [...foundProducts]
     })
    }

    const data = products.filter(product => {

      const subCategoryById =  subCategoryId ? product.subCategoryId == subCategoryId : true
      const bySearch =  model ? product.model.toLowerCase().includes(model.toLowerCase()) : true

      return   bySearch && subCategoryById
    })
    .filter(e => delete e.subCategoryId)

     res.status(200).json({
      message: "Found products",
      data: data
     })
  } catch (error) {
    return next(new InternalServerError(500, error.message))
  }
}

const GETBYID = (req, res, next) => {
  try {

    const { error, value } = ParamValidation.validate(req.params)

    if(error) {
     return next(new BadRequestError(error.message, 400))
    }

    const { id } = value

    const allProducts = read('products')

    const foundProduct = allProducts.find(e => e.productId == id)
    delete foundProduct.subCategoryId

    res.status(200).json({
      message: "product by id",
      data: foundProduct
    })
  } catch (error) {
    return next(new InternalServerError(500, 'Internal server error'))
  }
}

const POST = (req, res, next) => {
  try {
    const { error, value } = productPostValidation.validate(req.body)

  if(error) {
    next(new BadRequestError(400, error.message))
    return
  }

  const products = read('products')

  const { subCategoryId, productName, price, color, model } = value

  const newProduct = {
    productId : products.at(-1)?.productId + 1 || 1,
    subCategoryId,
    model,
    productName,
    color,
    price
  }
  if(products) products.push(newProduct)

  write('products', products)

   res.status(201).json({
    message: "product has been created"
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

  const {error: putError, value: putValue } = productPutValidation.validate(req.body)

  const products = read('products')

  const foundProduct = products.find(e => e.productId == id)

  if(putError) {
    return next(new BadRequestError(400 ,error.message))
  }

  const { subCategoryId, model, productName, color, price  } = putValue


  if(!foundProduct) {
    return next(new BadRequestError(404, `Job with this ${id} id is not found`))
  }

  foundProduct.subCategoryId = subCategoryId || foundProduct.subCategoryId
  foundProduct.model = model || foundProduct.model
  foundProduct.productName = productName || foundProduct.productName
  foundProduct.color = color || foundProduct.color
  foundProduct.price = price || foundProduct.price



  const updated = write('products', products)

  if(updated)  res.status(201).json({
    message: "product has been updated"
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

  const products = read('products')

  const index = products.findIndex(e => e.productId == id)

  if(index == -1) {
    return next(new NotFoundError(404,`Job with this ${id} id is not found`))
  }

  products.splice(index, 1)

  const deleted = write('products', products)

  if(deleted)  res.status(200).json({
    message: "product has been deleted"
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