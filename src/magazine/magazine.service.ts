import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMagazineDto } from './dto/create-magazine.dto';
import { UpdateMagazineDto } from './dto/update-magazine.dto';
import { Magazine } from 'src/entities/magazine.entity';

@Injectable()
export class MagazineService {
  constructor(
    @InjectRepository(Magazine)
    private magazineRepository: Repository<Magazine>,
  ) {}

  create(createMagazineDto: CreateMagazineDto): Promise<Magazine> {
    const magazine = this.magazineRepository.create(createMagazineDto);
    return this.magazineRepository.save(magazine);
  }

  async findAll(category?: string): Promise<Magazine[]> {
    if (category) {
      return this.magazineRepository.find({ where: { category } });
    }
    return this.magazineRepository.find();
  }

  findOne(id: string): Promise<Magazine> {
    return this.magazineRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    updateMagazineDto: UpdateMagazineDto,
  ): Promise<Magazine> {
    await this.magazineRepository.update(id, updateMagazineDto);
    return this.magazineRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<void> {
    await this.magazineRepository.delete(id);
  }

  async toggleActive(id: string): Promise<void> {
    const magazine = await this.findOne(id);
    if (magazine) {
      await this.magazineRepository.update(id, { isActive: !magazine.isActive });
    }
  }

  async findActive(): Promise<Magazine[]> {
    return this.magazineRepository.find({ where: { isActive: true } });
  }

  async findAllCategories(): Promise<string[]> {
    const categories = await this.magazineRepository
      .createQueryBuilder('magazine')
      .select('DISTINCT magazine.category', 'category')
      .getRawMany();

    return categories.map((c) => c.category);
  }
}

