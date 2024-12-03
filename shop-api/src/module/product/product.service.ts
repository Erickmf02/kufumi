import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./product";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CreateProductDto } from "./product.dto";
import { Order } from "../order/entities/order";
import { OnEvent } from "@nestjs/event-emitter";
import { OrderStatus } from "../order/enums/OrderStatus";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(dto: CreateProductDto) {
    return await this.productRepository.save(dto);
  }

  async find(): Promise<Product[]>{
    return await this.productRepository.find({
      order:{
        createdAt: 'DESC'
      }
    });
  }

  async findOne(id: number): Promise<Product> {
    const entity = await this.productRepository.findOne({where: { id }});
    if(!entity) throw new NotFoundException();
    return entity;
  }

  /**
   * Verifies if there is enough stock available for the given list of products.
   * 
   * This method checks the stock levels of each product in the provided `itemsDto` array.
   * For each product, it compares the requested stock with the available stock. If any product
   * does not have enough stock, a `BadRequestException` is thrown. Additionally, if a product
   * with a given ID does not exist, a `NotFoundException` will be thrown by the `findOne` method.
   * 
   * @param itemsDto - An array of objects, each containing:
   *   - `id`: The product ID.
   *   - `stock`: The requested stock amount for the product.
   * 
   * @returns A promise that resolves to an array of objects, each containing:
   *   - `stock`: The requested stock.
   *   - `product`: The product entity corresponding to the provided ID.
   * 
   * @throws {BadRequestException} If any product does not have enough stock available.
   * @throws {NotFoundException} If any product ID does not exist in the database.
   */
  async verifyStock(itemsDto: { id: number; stock: number }[]): Promise<{ stock: number; value: number, product: Product }[]> {
    const items = await Promise.all(
      itemsDto.map(async ({ id, stock: requestedStock }) => {
        const product = await this.findOne(id); // Uses the existing method to find the product
        if (product.stock < requestedStock) {
          throw new BadRequestException(
            `Insufficient stock for product ${product.name} (ID: ${id}). Requested: ${requestedStock}, Available: ${product.stock}`
          );
        }
        return {
          stock: requestedStock,
          value: product.value,
          product,
        };
      })
    );
    return items;
  }

  async findMany(ids: number[]): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: {
        id: In(ids),
      }
    });
  
    if (products.length !== ids.length) {
      throw new NotFoundException('One or more products not found');
    }
  
    return products;
  }


  @OnEvent('order.paid')
  private async updateStock(payload: Order) {
    const updatePromises = payload.items.map(async (item) => {
      const product = await this.productRepository.findOne({ where: { id: item.product.id } });

      if (!product) {
        throw new NotFoundException(`Product with ID ${item.product.id} not found`);
      }

      product.stock -= item.stock;

      if (product.stock < 0) {
        throw new BadRequestException(`Negative stock detected for product ${product.name} (ID: ${product.id}).`);
      }

      return this.productRepository.save(product);
    });

    // Wait for all the updates to complete
    await Promise.all(updatePromises);
  }

  async findTopProductsRecent() {
    const currentDate = new Date();

    // Calcula la fecha de 30 días atrás
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);

    const topProducts = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.orderItems', 'orderItem')
      .innerJoin('orderItem.order', 'order')
      .select('product')
      .addSelect('SUM(orderItem.stock) AS total_sold')  // Agrega una columna agregada
      .where('order.status = :status', { status: OrderStatus.PAID })
      .andWhere('order.createdAt BETWEEN :thirtyDaysAgo AND :currentDate', {
        thirtyDaysAgo,
        currentDate,
      })
      .groupBy('product.id')
      .orderBy('total_sold', 'DESC')
      .limit(6)
      .getRawAndEntities();


  
    // Mapeamos los resultados crudos a instancias de Product
    return topProducts.raw.map((raw)=>{
      const product = topProducts.entities.find((product) => product.id == raw.product_id) as any;
      product.total = parseInt(raw.total_sold);
      return product
    });
  }
  
  
  
  
  
  
  
  
  
  
  
}