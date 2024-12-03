import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { CreateProductDto } from "./product.dto";
import { ProductService } from "./product.service";
import { ParsePositiveIntPipe } from "src/common/pipes/parse-positive-int.pipe";
import { ParsePositiveIntArrayPipe } from "src/common/pipes/parse-positive-int-array.pipe";

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService
  ) {}

  @Post()
  async create(
    @Body() dto: CreateProductDto
  ){
    return await this.productService.create(dto);
  }

  @Get()
  async find(){
    return await this.productService.find();
  }

  @Get('many')
  async findMany(
    @Query('ids', ParsePositiveIntArrayPipe) ids: number[]
  ){
    return await this.productService.findMany(ids);
  }

  @Get('top-products')
  async getTopProductsRecent() {
    return this.productService.findTopProductsRecent();
  }


  @Get(':id')
  async findOne(
    @Param('id', ParsePositiveIntPipe) id: number
  ){
    return await this.productService.findOne(id);
  }
}