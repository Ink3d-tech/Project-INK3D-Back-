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

  findAll(): Promise<Magazine[]> {
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
    await this.magazineRepository.update(id, {
      isActive: !(await this.findOne(id)).isActive,
    });
  }
}
