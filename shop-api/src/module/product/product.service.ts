import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Product } from "./entities/product";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Not, Repository } from "typeorm";
import { CreateProductDto } from "./dto/create-product.dto";
import { Order } from "../order/entities/order";
import { OnEvent } from "@nestjs/event-emitter";
import { OrderStatus } from "../order/enums/OrderStatus";
import { ProductAvailabilityRequest } from "./interfaces/product-availability-request";
import { ProductAvailabilityResponse } from "./interfaces/product-availability-response";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}

  async create(dto: CreateProductDto) {
    const {characterId, ...productDto} = dto;

    const productData = {
      ...productDto,
      ...(characterId && { character: { id: characterId } }),
    };
    
    return await this.productRepository.save(productData);
  }

  async find(): Promise<Product[]> {
    return await this.productRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
  }

  async handleFindById(id: number) {
    const product = await this.productRepository.findOne({
      where: {id},
      relations: ['character', 'character.serie']
    })
    if (!product) throw new NotFoundException(`El producto con ID ${id} no se encontró.`);

    if(!product.character){
      return product;
    }

    const moreProductsOfTheSameCharacter = await this.productRepository.find({
      where: {
        id: Not(id),
        character: {
          id: product.character.id
        }
      },
      order: {
        createdAt: 'DESC'
      },
      take: 6
    })
    product.character.products = moreProductsOfTheSameCharacter

    return product;
  }

  async findById(id: number): Promise<Product> {
    const entity = await this.productRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`El producto con ID ${id} no se encontró.`);
    return entity;
  }

  
  async getStockAvailability(stockRequest: ProductAvailabilityRequest[]): Promise<ProductAvailabilityResponse[]> {
    const requestedIds = stockRequest.map(requestItem => requestItem.id);
    const requestedProducts = await this.productRepository.find({
      where: {
        id: In(requestedIds)
      }
    })
    // Encontrar los IDs de los productos que no se encontraron en la base de datos
    const foundIds = requestedProducts.map(product => product.id);
    const notFoundIds = requestedIds.filter(id => !foundIds.includes(id));

    if (notFoundIds.length > 0) {
      throw new NotFoundException(`Los productos con ID(s) ${notFoundIds.join(', ')} no fueron encontrados.`);
    }

    //generar un array de {quantity, id, product}
    const response: ProductAvailabilityResponse[] = stockRequest.map(requestItem => {
      const product = requestedProducts.find(p => p.id === requestItem.id);
  
      if (!product) {
        throw new NotFoundException(`El producto con ID ${requestItem.id} no se encontró.`);
      }
  
      return {
        ...requestItem, // Incluye `quantity` e `id` del request
        product, // Producto completo desde la base de datos
        isAvailable: product.stock >= requestItem.quantity
      };
    });
  
    return response;
  }

  async findMany(ids: number[]): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: {
        id: In(ids),
      }
    });

    if (products.length !== ids.length) {
      throw new NotFoundException('Uno o más productos no se encontraron.');
    }

    return products;
  }

  @OnEvent('order.paid')
  private async updateStock(payload: Order) {
    const updatePromises = payload.items.map(async (item) => {
      const product = await this.productRepository.findOne({ where: { id: item.product.id } });

      if (!product) {
        throw new NotFoundException(`El producto con ID ${item.product.id} no se encontró.`);
      }

      product.stock -= item.quantity;
      product.purchases += item.quantity;

      if (product.stock < 0) {
        throw new ConflictException(
          `Se detectó un stock negativo para el producto "${product.name}" (ID: ${product.id}).`
        );
      }

      return this.productRepository.save(product);
    });

    // Esperar a que todas las actualizaciones se completen
    await Promise.all(updatePromises);
  }

  async findProductByPopularity(position: number) {
    const maxPosition = 10;
    if (position < 1 || position > maxPosition) {
      throw new NotFoundException(`La posición solicitada debe estar entre 1 y ${maxPosition}.`);
    }
  
    const currentDate = new Date();
  
    // Calcula la fecha de 30 días atrás
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
  
    // Obtener el producto en la posición deseada
    const result = await this.productRepository
      .createQueryBuilder('product')
      .innerJoin('product.orderItems', 'orderItem')
      .innerJoin('orderItem.order', 'order')
      .select('product')
      .addSelect('SUM(orderItem.quantity)', 'total_sold') // Calcular total vendido
      .where('order.status = :status', { status: OrderStatus.PAID })
      .andWhere('order.createdAt BETWEEN :thirtyDaysAgo AND :currentDate', {
        thirtyDaysAgo,
        currentDate,
      })
      .groupBy('product.id')
      .orderBy('total_sold', 'DESC')
      .skip(position - 1) // Saltar productos hasta la posición deseada
      .take(1) // Tomar solo un producto
      .getRawAndEntities();
  
    // Verificar si el producto existe
    if (result.raw.length === 0) {
      throw new NotFoundException(`No se encontró un producto en la posición ${position}.`);
    }
  
    // Mapear el resultado
    const rawProduct = result.raw[0];
    const product = result.entities.find((p) => p.id == rawProduct.product_id) as any;

    const fullProduct = await this.handleFindById(product.id) as any;

    fullProduct.total = parseInt(rawProduct.total_sold);
    fullProduct.position = position;
  
    return fullProduct;
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
      .addSelect('SUM(orderItem.quantity)', 'total_sold') // Agrega una columna agregada
      .where('order.status = :status', { status: OrderStatus.PAID })
      .andWhere('order.createdAt BETWEEN :thirtyDaysAgo AND :currentDate', {
        thirtyDaysAgo,
        currentDate,
      })
      .groupBy('product.id')
      .orderBy('total_sold', 'DESC')
      .limit(6)
      .getRawAndEntities();

    // Mapear los resultados crudos a instancias de Product
    return topProducts.raw.map((raw, index) => {
      const product = topProducts.entities.find((product) => product.id == raw.product_id) as any;
      product.total = parseInt(raw.total_sold);
      product.position = index + 1;
      return product;
    });
  }
}
